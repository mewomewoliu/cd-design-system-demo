import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function resolveValue(token) {
  const val = token.$value;
  if (val && typeof val === 'object' && 'hex' in val) {
    return val.hex;
  }
  return val;
}

function makeToken(rawToken, description) {
  return {
    $value: resolveValue(rawToken),
    $type: rawToken.$type,
    $description: description,
  };
}

// Flat keys like "Charade-source", "Pale Snow-10" → nested { "Pale-Snow": { "10": token } }
// Palette names with spaces are normalised to hyphens for valid CSS variable names.
function convertPrimitiveColors(colors) {
  const result = {};
  for (const [key, token] of Object.entries(colors)) {
    const lastDash = key.lastIndexOf('-');
    const rawPalette = key.substring(0, lastDash);
    const stop = key.substring(lastDash + 1);
    const paletteName = rawPalette.replace(/\s+/g, '-');
    if (!result[paletteName]) result[paletteName] = {};
    result[paletteName][stop] = makeToken(
      token,
      `${paletteName} ${stop} — primitive colour value`
    );
  }
  return result;
}

// Flat keys like "spacing-xs" → strip prefix → { "xs": token }
function convertPrimitiveScale(tokens, category) {
  if (!tokens) return {};
  const prefix = `${category}-`;
  const result = {};
  for (const [key, token] of Object.entries(tokens)) {
    if (key === '$extensions') continue;
    if (!token.$type) continue;
    const cleanKey = key.startsWith(prefix) ? key.slice(prefix.length) : key;
    const val = resolveValue(token);
    let description = `${category} ${cleanKey} — ${val}`;
    if (category === 'spacing') description = `Spacing scale ${cleanKey} — ${val}px base grid`;
    if (category === 'font-size') description = `Font size ${cleanKey} — ${val}px`;
    if (category === 'shadow') description = `Shadow ${cleanKey} — elevation token`;
    result[cleanKey] = makeToken(token, description);
  }
  return result;
}

// Preserve keys as-is within each semantic group
function convertSemanticSection(tokens, group) {
  const result = {};
  for (const [key, token] of Object.entries(tokens)) {
    if (key === '$extensions') continue;
    if (!token.$type) continue;
    let description = '';
    if (group === 'colors') {
      description = `Semantic colour role — ${key}`;
    } else if (group === 'spacing') {
      description = `Semantic spacing alias — ${resolveValue(token)}px`;
    } else if (group === 'typography') {
      description = `Semantic typography alias for ${key}`;
    } else {
      description = `Semantic ${group} alias for ${key}`;
    }
    result[key] = makeToken(token, description);
  }
  return result;
}

// Component section: flat token keys + nested "colors" sub-object
function convertComponentSection(tokens, componentName) {
  const result = {};
  for (const [key, value] of Object.entries(tokens)) {
    if (key === '$extensions') continue;
    if (key === 'colors') {
      result.colors = {};
      for (const [colorKey, colorToken] of Object.entries(value)) {
        if (colorKey === '$extensions') continue;
        if (!colorToken.$type) continue;
        result.colors[colorKey] = makeToken(
          colorToken,
          `Component token — ${componentName} ${colorKey}`
        );
      }
      continue;
    }
    if (!value.$type) continue;
    result[key] = makeToken(value, `Component token — ${componentName} ${key}`);
  }
  return result;
}

// ── Read source files ────────────────────────────────────────────────────────

const primitive = JSON.parse(
  readFileSync(resolve(__dirname, 'tokens-primitive.json'), 'utf8')
);
const semantic = JSON.parse(
  readFileSync(resolve(__dirname, 'tokens-semantic.json'), 'utf8')
);
const components = JSON.parse(
  readFileSync(resolve(__dirname, 'tokens-components.json'), 'utf8')
);

// ── Build output ─────────────────────────────────────────────────────────────

const output = {
  primitives: {
    colors: convertPrimitiveColors(primitive.colors),
    spacing: convertPrimitiveScale(primitive.spacing, 'spacing'),
    'font-size': convertPrimitiveScale(primitive['font-size'], 'font-size'),
    'font-weight': convertPrimitiveScale(primitive['font-weight'], 'font-weight'),
    'line-height': convertPrimitiveScale(primitive['line-height'], 'line-height'),
    'border-radius': convertPrimitiveScale(primitive['border-radius'], 'border-radius'),
    breakpoint: convertPrimitiveScale(primitive.breakpoint, 'breakpoint'),
    shadow: convertPrimitiveScale(primitive.shadow, 'shadow'),
    'font-family': convertPrimitiveScale(primitive['font-family'], 'font-family'),
    height: convertPrimitiveScale(primitive.height, 'height'),
    size: convertPrimitiveScale(primitive.size, 'size'),
  },
  semantic: {},
  components: {},
};

// All semantic groups from source (spacing, typography, border, shadow, breakpoint, colors)
for (const [sectionKey, sectionData] of Object.entries(semantic)) {
  if (sectionKey === '$extensions') continue;
  if (typeof sectionData !== 'object' || sectionData === null) continue;
  output.semantic[sectionKey] = convertSemanticSection(sectionData, sectionKey);
}

// All component sections from source
for (const [componentName, componentTokens] of Object.entries(components)) {
  if (componentName === '$extensions') continue;
  if (typeof componentTokens !== 'object' || componentTokens === null) continue;
  output.components[componentName] = convertComponentSection(componentTokens, componentName);
}

// ── Write output ─────────────────────────────────────────────────────────────

const outputPath = resolve(__dirname, '../tokens.json');
writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log('✓ Converted tokens written to packages/tokens/src/tokens.json');
console.log(`  Primitives: ${Object.keys(output.primitives).length} categories`);
console.log(`  Semantic: ${Object.keys(output.semantic).length} groups`);
console.log(`  Components: ${Object.keys(output.components).length} components`);
console.log(`  Colour palettes: ${Object.keys(output.primitives.colors).length}`);
