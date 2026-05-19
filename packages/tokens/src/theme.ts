import { createTheme, rem, type MantineColorsTuple } from '@mantine/core';

// Charade palette — primary brand colour (dark blue-grey)
// Source: primitives.colors.Charade in tokens.json
const charade: MantineColorsTuple = [
  '#DBE3EE', // 0 — Charade-10 (lightest)
  '#AEB7C3', // 1 — Charade-20
  '#838C98', // 2 — Charade-30
  '#5B646F', // 3 — Charade-40
  '#373E47', // 4 — Charade-50
  '#262F39', // 5 — Charade-source (primary)
  '#181C21', // 6 — Charade-60 (darkest)
  '#12161a', // 7 — extrapolated dark
  '#0c1013', // 8 — extrapolated darker
  '#06080a', // 9 — extrapolated darkest
];

// Pale Snow palette — neutral/surface colour
// Source: primitives.colors.Pale-Snow in tokens.json
const paleSnow: MantineColorsTuple = [
  '#F0F3F8', // 0 — Pale Snow-source (lightest)
  '#E0E3E7', // 1 — Pale Snow-10
  '#B3B6BA', // 2 — Pale Snow-20
  '#898C90', // 3 — Pale Snow-30
  '#616367', // 4 — Pale Snow-40
  '#3C3E41', // 5 — Pale Snow-50
  '#1A1C1D', // 6 — Pale Snow-60 (darkest)
  '#141516', // 7 — extrapolated
  '#0e0f10', // 8 — extrapolated
  '#080809', // 9 — extrapolated
];

export const theme = createTheme({
  colors: {
    brand: charade,
    neutral: paleSnow,
  },
  primaryColor: 'brand',
  primaryShade: { light: 5, dark: 4 },

  // Font families from primitives — Manrope primary, Inter secondary
  fontFamily: 'Manrope, Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  fontFamilyMonospace: 'JetBrains Mono, Fira Code, monospace',

  // Font sizes from semantic typography tokens
  fontSizes: {
    xs: rem(12), // font-size-caption
    sm: rem(14), // font-size-label
    md: rem(16), // font-size-body
    lg: rem(18),
    xl: rem(20), // font-size-heading
  },

  // Spacing from semantic spacing tokens
  spacing: {
    xs: rem(8), // spacing-xs
    sm: rem(12), // spacing-sm / spacing-inline
    md: rem(16), // spacing-md
    lg: rem(20), // spacing-lg
    xl: rem(32), // spacing-xl / spacing-section
  },

  // Border radius from primitive tokens
  radius: {
    xs: rem(2), // border-radius-xs
    sm: rem(4), // border-radius-sm
    md: rem(8), // border-radius-md
    lg: rem(16), // border-radius-lg
    xl: rem(32), // border-radius-xl
  },

  // Line heights from primitive tokens
  lineHeights: {
    xs: '1.4',
    sm: '1.45',
    md: '1.55',
    lg: '1.6',
    xl: '1.65',
  },

  headings: {
    fontWeight: '700',
    sizes: {
      h1: { fontSize: rem(36), lineHeight: '1.2' },
      h2: { fontSize: rem(30), lineHeight: '1.25' },
      h3: { fontSize: rem(24), lineHeight: '1.3' },
      h4: { fontSize: rem(20), lineHeight: '1.35' },
      h5: { fontSize: rem(18), lineHeight: '1.4' },
      h6: { fontSize: rem(16), lineHeight: '1.45' },
    },
  },

  // Shadows from primitive shadow tokens
  shadows: {
    xs: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0 10px 15px -5px, rgba(0, 0, 0, 0.04) 0 7px 7px -5px',
    md: '0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0 20px 25px -5px, rgba(0, 0, 0, 0.04) 0 10px 10px -5px',
    lg: '0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.02) 0 30px 40px -5px, rgba(0, 0, 0, 0.02) 0 20px 20px -5px',
    xl: '0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0 50px 100px -20px, rgba(0, 0, 0, 0.03) 0 30px 60px -30px',
  },

  // Breakpoints from primitive tokens
  breakpoints: {
    xs: '36em', // 576px
    sm: '48em', // 768px
    md: '62em', // 992px
    lg: '75em', // 1200px
    xl: '88em', // 1408px
  },

  // Component defaults from component tokens
  components: {
    Button: {
      defaultProps: { radius: 'md' },
    },
    TextInput: {
      defaultProps: { radius: 'md' },
    },
    Select: {
      defaultProps: { radius: 'md' },
    },
    Card: {
      defaultProps: { radius: 'lg', shadow: 'sm' },
    },
    Badge: {
      defaultProps: { radius: 'sm' },
    },
    Modal: {
      defaultProps: { radius: 'md' },
    },
  },
});
