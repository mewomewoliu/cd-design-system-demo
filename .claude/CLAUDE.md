# Collective Discovery design system — Claude Code context

---

## Stack

- **React 19** — all components target React 19. Use the new JSX transform (`react-jsx`); never import React explicitly unless using hooks.
- **TypeScript strict mode** — `"strict": true` is enforced in `tsconfig.base.json`. No `any` types without explicit justification. All props interfaces must be fully typed.
- **Mantine 8** — the component foundation for this design system. Rules:
  - `MantineProvider` and `createTheme` **must always** be used to apply design values.
  - **Never use raw CSS** for design values (colour, spacing, radius, font size). Every value must come through the Mantine theme or a design token variable.
  - Use `theme.colors`, `theme.spacing`, `theme.radius`, `theme.fontSizes` exclusively for these properties.
  - The `sx` prop **does not exist in Mantine v8** — do not use it under any circumstances.
- **pnpm monorepo with Turborepo** — package manager is `pnpm` only. Never use `npm` or `yarn`. Turborepo orchestrates the build pipeline.
- **Storybook 8** — documentation lives in `packages/docs`. Every component must have a corresponding story file.

---

## Packages

This monorepo contains exactly three packages. Understand the purpose and boundaries of each before making changes.

### `@collective-discovery/tokens` (`packages/tokens`)

Design token definitions and build outputs. This package owns all raw token values (colour palette, spacing scale, radius, typography, etc.) and uses Style Dictionary to compile them into multiple output formats (CSS custom properties, JS/TS constants).

- **Never import from `dist/` directly** during development. Use `tsconfig` path aliases to resolve to the source `src/index.ts`.
- Token values are defined in `packages/tokens/src/tokens.json`.
- This package imports **nothing** from other packages in this repo.

### `@collective-discovery/components` (`packages/components`)

All React component implementations for the design system. This is the primary package that consumers of the design system install.

- Every component must be **exported from `src/index.ts`** — no deep imports.
- Components extend Mantine base components; they do not build from scratch when Mantine has an equivalent.
- This package may import from `@collective-discovery/tokens`. It imports **nothing** from `@collective-discovery/docs`.

### `@collective-discovery/docs` (`packages/docs`)

Storybook documentation site only. This package is `private: true` and is never published or imported by any other package.

- Imports from both `@collective-discovery/components` and `@collective-discovery/tokens`.
- Contains `.storybook/` configuration and all `*.stories.tsx` files.
- No business logic or component implementations live here.

### Dependency boundary rule

```
docs → components → tokens
docs → tokens
(tokens imports nothing internal)
```

This is strictly enforced. Any import that reverses this direction is a bug.

---

## Token rules — CRITICAL

These rules are non-negotiable. Violations must be caught by ESLint and fixed before merging.

- **NEVER hardcode hex colours** in component files. No `#fff`, `#1a1a2e`, or any hex string.
- **NEVER hardcode px values** for spacing, radius, or font sizes. No `16px`, `0.5rem` raw strings.
- **NEVER hardcode font sizes** as literal values.
- **Colours** — always reference via:
  - `theme.colors.[name][shade]` inside `createTheme` or `useComputedColorScheme`
  - `var(--mantine-color-[name]-[shade])` in CSS Modules
- **Spacing** — always use:
  - `theme.spacing.xs | sm | md | lg | xl`
  - Mantine's `rem()` utility for size values passed to theme overrides
- **Border radius** — always use:
  - `theme.radius.xs | sm | md | lg | xl`
- **Font sizes** — always use:
  - `theme.fontSizes.xs | sm | md | lg | xl`
- All semantic token values live in `packages/tokens/src/tokens.json`. When a new colour or scale value is needed, it is added there first, then referenced through the theme.
- Use Mantine's `rem()` for all size values passed to theme overrides — never raw `px` strings.

---

## Component conventions

Follow these conventions exactly when creating or modifying components.

- **Props interface** — every component exports a typed `Props` interface alongside the component definition. The interface name is `[ComponentName]Props`. Example: `ButtonProps`.
- **Variants as union types** — variants are typed as string literal unions, not enums. Example:
  ```ts
  type ButtonVariant = 'filled' | 'outline' | 'ghost' | 'destructive';
  ```
- **Always extend Mantine** — never build a component from scratch if Mantine has an equivalent. Wrap and extend with typed props, custom styles, and token-based theme overrides.
- **Compound component pattern** — complex components with subparts use the compound pattern:
  ```tsx
  <Card>
    <Card.Header />
    <Card.Body />
  </Card>
  ```
- **Styling** — use Mantine's `styles` API or CSS Modules for custom styles. The `sx` prop was removed in Mantine v8; do not use it.
- **Accessibility** — all interactive components must include appropriate `aria-*` attributes. Buttons need `aria-label` when icon-only. Form controls need `aria-describedby` for error messages.

---

## File structure for every new component

Every new component must follow this exact layout. All four files are required.

```
packages/components/src/[ComponentName]/
  index.ts                        ← re-export only, no logic
  [ComponentName].tsx             ← implementation
  [ComponentName].stories.tsx     ← Storybook stories (required)
  [ComponentName].test.tsx        ← Vitest unit tests
```

The `index.ts` re-export file should contain only:
```ts
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName';
```

After creating the files, add the export to `packages/components/src/index.ts`.

---

## Firebase auth rule

Firebase is a product-app concern and must never leak into the design system packages.

- **NEVER import Firebase** in any file inside `packages/components` or `packages/tokens`.
- **NEVER import Firebase** in any file inside `packages/docs`.
- Auth state is passed as props only — never accessed or fetched inside design system components.
- Components that display user-specific information use the following prop shape, and no other:

```ts
interface AuthAwareProps {
  user?: {
    displayName: string;
    photoURL?: string;
    email: string;
  };
  isLoading?: boolean;
}
```

If a component needs to conditionally render based on auth state, it accepts the `AuthAwareProps` shape and the parent (product app) passes the values down.

---

## Do not list

The following are hard prohibitions in this codebase:

- Do not use `style={{}}` inline except for dynamic computed values that genuinely cannot come from tokens (e.g., a CSS variable computed at runtime from a prop).
- Do not hardcode any colour, spacing, radius, or font value — use tokens and theme values.
- Do not re-export Mantine components unchanged without extension or documentation. Wrapping adds typed props, token integration, and stories.
- Do not use the `sx` prop — it was removed in Mantine v8 and will cause a type error.
- Do not import Firebase anywhere in `packages/components` or `packages/tokens`.
- Do not import from `*/dist/*` paths during development — use source paths resolved via `tsconfig` `paths` config.
- Do not create one-off `className` strings with raw values outside the token system.
- Do not use `npm` or `yarn` — `pnpm` only throughout.
- Do not install Storybook outside of `packages/docs`.
- Do not add component logic inside `index.ts` re-export files.

---

## When generating a new component, always

Follow these steps in order. Do not skip any step.

1. **Check Mantine first** — before building anything, check if Mantine 8 already has this component. If it does, extend it via `createTheme` component overrides or wrap it with typed props. Do not rebuild what Mantine provides.
2. **Extend via createTheme** — if Mantine has the component, use `createTheme({ components: { MantineComponent: { ... } } })` for style overrides. Keep token values in `packages/tokens`.
3. **Create the Storybook story in the same task** — the story file (`[ComponentName].stories.tsx`) must be created alongside the component, not as a follow-up. A component without a story is incomplete.
4. **Add JSDoc on every prop** — every property in the `Props` interface gets a JSDoc comment (`/** ... */`) so Storybook autodocs renders descriptions automatically.
5. **Lint check before finishing** — mentally verify: no hex values, no `sx` prop, no Firebase imports, no `*/dist/*` imports, no raw spacing values.
6. **Export from index** — add the component and its `Props` type to `packages/components/src/index.ts` before marking the task complete.
