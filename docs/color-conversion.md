# Color Conversion Script — Developer Guide

How to turn three customer-configured brand colors into a complete
`react-native-paper` (Material Design 3) theme.

All conversion logic lives in [`src/theme.js`](../src/theme.js). This document
explains what it does, the public API, the rules it applies, and how to
integrate it into an app.

---

## 1. Concept

A white-label customer configures **exactly three** brand colors in the admin
panel:

| Role        | Example (New TecDoc) |
| ----------- | -------------------- |
| `primary`   | `#00529D`            |
| `secondary` | `#2C3647`            |
| `tertiary`  | `#E87B00`            |

Material Design 3 would normally derive a *full* tonal palette (containers,
surfaces, outlines, inverse colors, …) from these. We deliberately **do not**
want that. The rules are:

1. **Only** `primary`, `secondary`, `tertiary` and their `on*` colors come from
   the brand.
2. **Everything else** (background, surface, outline, all `*Container` tokens,
   elevation levels, …) is a fixed neutral gray/black ramp.
3. **On-colors** (`onPrimary`, …) are computed automatically for readable
   contrast.
4. **Dark mode** lightens the brand colors using MD3 tonal logic, so a dark
   blue in light mode becomes a lighter blue in dark mode.

The result is a clean UI where the brand shows up only as accents.

---

## 2. Public API

```js
import { buildTheme, brandForMode, onColorFor } from './theme.js';
```

### `buildTheme(brand, mode) → MD3Theme`

The main entry point. Produces a complete, valid Paper theme.

| Param   | Type                                              | Description              |
| ------- | ------------------------------------------------- | ------------------------ |
| `brand` | `{ primary: string, secondary: string, tertiary: string }` | Hex colors (`#RRGGBB` or `#RGB`). |
| `mode`  | `'light' \| 'dark'`                               | Target color scheme.     |

Returns an object ready to pass to `<PaperProvider theme={...}>`. It includes
`colors`, `dark`, and `fonts`.

```js
const lightTheme = buildTheme(
  { primary: '#00529D', secondary: '#2C3647', tertiary: '#E87B00' },
  'light'
);
```

### `brandForMode(hex, isDark, darkTone = 80) → string`

Maps a single configured brand color to the value used in the given mode.

- **Light mode** (`isDark = false`): returns the hex **unchanged** (WYSIWYG for
  the admin).
- **Dark mode** (`isDark = true`): builds the MD3 tonal palette from the color
  (preserving hue + chroma) and returns **tone `darkTone`** (default `80`, the
  MD3 dark-scheme primary tone).
- Invalid / partial hex is returned unchanged (safe while a user is typing).

```js
brandForMode('#00529D', false); // '#00529D'  (light: as configured)
brandForMode('#00529D', true);  // lighter blue (dark: MD3 tone 80)
```

### `onColorFor(background) → '#000000' | '#FFFFFF'`

Returns the readable foreground color for a background, choosing black or white
by the higher WCAG 2.x contrast ratio.

```js
onColorFor('#00529D'); // '#FFFFFF'
onColorFor('#E87B00'); // '#000000'
```

---

## 3. Conversion rules in detail

### 3.1 Brand colors → theme tokens

For each of the three roles, `buildTheme` sets:

```
primary   = brandForMode(brand.primary, isDark)
onPrimary = onColorFor(primary)
```

…and the same for `secondary` / `tertiary`. These six values are the **only**
brand-derived entries in the theme.

### 3.2 On-color contrast

`onColorFor` computes relative luminance per WCAG 2.x and picks `#000` or `#fff`
— whichever has the higher contrast ratio against the brand color. This keeps
label text on buttons/chips legible for any brand color, in both modes.

### 3.3 Dark-mode tonal mapping

Powered by [`@material/material-color-utilities`](https://www.npmjs.com/package/@material/material-color-utilities):

```
HCT  = Hct.fromInt(argbFromHex(hex))             // decompose to hue/chroma/tone
pal  = TonalPalette.fromHueAndChroma(hue, chroma) // MD3 tonal palette
dark = hexFromArgb(pal.tone(80))                  // dark-scheme tone
```

MD3's own schemes read different tones per mode (light primary = tone 40, dark
primary = tone 80). We keep light mode verbatim and apply tone 80 for dark, so
the brand stays recognizable but is appropriately lighter on dark surfaces.

### 3.4 Neutral (non-brand) palette

`lightNeutral` and `darkNeutral` in `theme.js` define every non-brand token as a
pure gray/black/white value, including:

- `background`, `surface`, `surfaceVariant`, `onSurface`, `onSurfaceVariant`
- `outline`, `outlineVariant`
- **all `*Container` tokens** (`primaryContainer`, `secondaryContainer`, …) —
  intentionally neutral
- `elevation.level0…level5`
- `inverse*`, `shadow`, `scrim`, `backdrop`

`error` / `onError` stay a conventional red so destructive states remain clear.

> **Note:** Because containers are neutral, MD3 components that tint themselves
> with container tokens (selected `Chip`, `FAB`, the active `BottomNavigation`
> indicator, …) appear gray rather than branded. This is intentional. To brand
> them, point the relevant `*Container` token at a tint of the brand color (see
> §5).

---

## 4. Integration

```jsx
import { PaperProvider } from 'react-native-paper';
import { buildTheme } from './theme.js';

function App() {
  const brand = { primary: '#00529D', secondary: '#2C3647', tertiary: '#E87B00' };
  const mode = useColorScheme(); // 'light' | 'dark'
  const theme = useMemo(() => buildTheme(brand, mode), [brand, mode]);

  return (
    <PaperProvider theme={theme}>
      <YourApp />
    </PaperProvider>
  );
}
```

Read `brand` from wherever the admin panel stores it (API, config, etc.). The
three values are all the script needs.

### Dependencies

```
react-native-paper
@material/material-color-utilities
```

---

## 5. Customization

| Want to change…                  | Where                                                            |
| -------------------------------- | --------------------------------------------------------------- |
| How light brand colors get in dark mode | `darkTone` arg of `brandForMode` (default `80`; lower = darker) |
| Neutral grays                    | `lightNeutral` / `darkNeutral` objects                          |
| Make a container brand-tinted    | Override that `*Container` token in the neutral object, e.g. derive it via `brandForMode(brand.secondary, isDark, 90)` |
| Error colors                     | `error` / `onError` / `errorContainer` in the neutral objects   |
| Font                             | `interFonts` (`configureFonts({ config: { fontFamily } })`)     |

### Example: brand-tinted selected components

If you want selected chips / active nav to use the brand instead of gray:

```js
// inside buildTheme, after computing `secondary`
secondaryContainer: isDark
  ? brandForMode(brand.secondary, true, 30)  // dark, low tone
  : '#E4ECF5',                               // light tint of the brand
onSecondaryContainer: onColorFor(/* the value above */),
```

---

## 6. Component token overrides (restoring brand color)

Because the neutral palette forces every non-brand token grey, some MD3
components that normally tint themselves with *container* tokens render grey.
You can reassign those component tokens back to the brand colors.

The demo's **Modified Components** page (header → palette-swatch icon) shows a
live before / after for each of these.

| Component | Token change |
| --------- | ------------ |
| Chip (selected / filter) | `secondaryContainer → primary`, `onSecondaryContainer → onPrimary` |
| Segmented buttons (selected) | `secondaryContainer → primary`, `onSecondaryContainer → onPrimary` |
| FAB | `primaryContainer → primary`, `onPrimaryContainer → onPrimary` |

### Apply app-wide

Set the tokens in `buildTheme` so every instance picks up the brand color:

```js
// inside buildTheme → colors: { ... }
secondaryContainer: primary,
onSecondaryContainer: onColorFor(primary),
primaryContainer: primary,
onPrimaryContainer: onColorFor(primary),
```

### Apply to a single subtree

Wrap only the components you want to restyle in a nested `PaperProvider` whose
theme overrides those tokens (this is what the Modified Components page does, so
the global theme stays neutral):

```jsx
const branded = {
  ...theme,
  colors: {
    ...theme.colors,
    secondaryContainer: theme.colors.primary,
    onSecondaryContainer: theme.colors.onPrimary,
  },
};

<PaperProvider theme={branded}>
  <Chip selected>Filter</Chip>
</PaperProvider>;
```

> **Note:** `secondaryContainer` drives selected Chips, selected SegmentedButtons
> and the active BottomNavigation indicator, so reassigning it brands all three
> at once.

---

## 7. Two-tone branded SVG icons

Specialized icons that need two brand tones follow a single convention so they
restyle with the theme. See [`src/icons/ThemedIcon.jsx`](../src/icons/ThemedIcon.jsx)
and [`src/icons/any_number.svg`](../src/icons/any_number.svg).

**Rule:** draw everything with `currentColor`.

- Glyph (foreground) → solid `currentColor` = **primary**.
- Container (background) → `currentColor` with `fill-opacity="0.2"` = **20% of
  primary** (the "surface variant" tone).

```svg
<svg viewBox="0 0 24 24" width="24" height="24">
  <rect x="2" y="2" width="20" height="20" rx="5"
        fill="currentColor" fill-opacity="0.2" />
  <g fill="currentColor"><!-- glyph paths --></g>
</svg>
```

Set the icon's `color` to the brand primary and both tones follow
automatically, in light and dark mode:

```jsx
<svg style={{ color: theme.colors.primary }}>…</svg>
```

To add a new icon, paste its `<path>` data into a new entry in
`ThemedIcon.jsx`, marking which parts are the container (variant) vs the glyph
(primary).

---

## 8. Edge cases

- **Invalid/partial hex** (e.g. while typing): `brandForMode` returns the input
  unchanged; `onColorFor` tolerates `#RGB` and `#RRGGBB`.
- **Very low-chroma brand colors** (near gray): the dark-mode tone still
  resolves; the result is a light gray, which is expected.
- **Determinism:** `buildTheme` is pure — same input always yields the same
  theme. Memoize it on `[brand, mode]`.
```
