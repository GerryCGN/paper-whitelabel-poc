import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';
import {
  Hct,
  TonalPalette,
  argbFromHex,
  hexFromArgb,
} from '@material/material-color-utilities';

/**
 * White-label theming concept
 * --------------------------------------------------------------------------
 * Customers configure exactly THREE brand colors in the admin panel:
 *   - primary
 *   - secondary
 *   - tertiary
 *
 * Material Design 3 would normally derive a full tonal palette from these
 * (containers, surfaces, outlines, inverse colors, ...). We explicitly do NOT
 * want that: every non-brand color stays a neutral gray / black ramp so the
 * brand colors are the only accents in the UI.
 *
 * This module is "the script": it takes the 3 brand colors + a mode and
 * produces a complete, valid react-native-paper MD3 theme. The only values
 * derived from the brand colors are primary/secondary/tertiary themselves and
 * their matching On-colors (computed for contrast / readability).
 */

/* ---------- color math helpers ---------- */

function hexToRgb(hex) {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const int = parseInt(h, 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

// Relative luminance per WCAG 2.x
function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const channel = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(a, b) {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Pick the readable "On" color (#000 or #fff) for any given background color.
 * Whichever gives the higher contrast ratio wins.
 */
export function onColorFor(background) {
  const black = '#000000';
  const white = '#FFFFFF';
  return contrastRatio(background, white) >= contrastRatio(background, black)
    ? white
    : black;
}

/* ---------- MD3 tonal mapping (per mode) ---------- */

const HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

/**
 * Map a configured brand color to its Material Design 3 tonal value for the
 * given mode, using the same tonal palette MD3 derives from a source color.
 *
 * MD3 does NOT use a brand color verbatim in both schemes: it builds a tonal
 * palette (fixed hue + chroma) and reads a different *tone* per scheme:
 *   - light scheme primary  -> tone 40 (darker)
 *   - dark  scheme primary  -> tone 80 (lighter)
 *
 * To keep the admin panel WYSIWYG, light mode shows the configured color
 * exactly as picked. Dark mode lightens it to the MD3 dark tone (80) of the
 * palette derived from that same color — so e.g. a dark blue becomes a
 * lighter blue in dark mode, exactly as Material Design intends.
 *
 * @param {string} hex   configured brand color
 * @param {boolean} isDark
 * @param {number} darkTone  target tone for dark mode (default 80, the MD3 value)
 */
export function brandForMode(hex, isDark, darkTone = 80) {
  if (!isDark) return hex; // light = exactly as configured
  if (!HEX_RE.test((hex || '').trim())) return hex; // guard against partial input
  try {
    const hct = Hct.fromInt(argbFromHex(hex));
    const palette = TonalPalette.fromHueAndChroma(hct.hue, hct.chroma);
    return hexFromArgb(palette.tone(darkTone));
  } catch {
    return hex;
  }
}

/* ---------- neutral (non-brand) palettes ---------- */
// These are intentionally pure grays/black/white. No brand hue leaks in here.

const lightNeutral = {
  background: '#FFFFFF',
  onBackground: '#1A1A1A',
  surface: '#FFFFFF',
  onSurface: '#1A1A1A',
  surfaceVariant: '#E4E4E4',
  onSurfaceVariant: '#454545',
  surfaceDisabled: 'rgba(26, 26, 26, 0.12)',
  onSurfaceDisabled: 'rgba(26, 26, 26, 0.38)',
  outline: '#767676',
  outlineVariant: '#C7C7C7',
  // Brand containers are forced neutral on purpose.
  primaryContainer: '#E4E4E4',
  onPrimaryContainer: '#1A1A1A',
  secondaryContainer: '#E4E4E4',
  onSecondaryContainer: '#1A1A1A',
  tertiaryContainer: '#E4E4E4',
  onTertiaryContainer: '#1A1A1A',
  // Error stays a conventional red so destructive states remain legible.
  error: '#B3261E',
  onError: '#FFFFFF',
  errorContainer: '#F2DEDD',
  onErrorContainer: '#410E0B',
  inverseSurface: '#2E2E2E',
  inverseOnSurface: '#F2F2F2',
  inversePrimary: '#BFBFBF',
  shadow: '#000000',
  scrim: '#000000',
  backdrop: 'rgba(0, 0, 0, 0.4)',
  elevation: {
    level0: 'transparent',
    level1: '#F4F4F4',
    level2: '#EDEDED',
    level3: '#E6E6E6',
    level4: '#E0E0E0',
    level5: '#DBDBDB',
  },
};

const darkNeutral = {
  background: '#121212',
  onBackground: '#E6E6E6',
  surface: '#1A1A1A',
  onSurface: '#E6E6E6',
  surfaceVariant: '#2C2C2C',
  onSurfaceVariant: '#C7C7C7',
  surfaceDisabled: 'rgba(230, 230, 230, 0.12)',
  onSurfaceDisabled: 'rgba(230, 230, 230, 0.38)',
  outline: '#8F8F8F',
  outlineVariant: '#3D3D3D',
  primaryContainer: '#2C2C2C',
  onPrimaryContainer: '#E6E6E6',
  secondaryContainer: '#2C2C2C',
  onSecondaryContainer: '#E6E6E6',
  tertiaryContainer: '#2C2C2C',
  onTertiaryContainer: '#E6E6E6',
  error: '#F2B8B5',
  onError: '#601410',
  errorContainer: '#8C1D18',
  onErrorContainer: '#F9DEDC',
  inverseSurface: '#E6E6E6',
  inverseOnSurface: '#2E2E2E',
  inversePrimary: '#4D4D4D',
  shadow: '#000000',
  scrim: '#000000',
  backdrop: 'rgba(0, 0, 0, 0.5)',
  elevation: {
    level0: 'transparent',
    level1: '#222222',
    level2: '#272727',
    level3: '#2C2C2C',
    level4: '#2E2E2E',
    level5: '#333333',
  },
};

export const defaultBrand = {
  primary: '#6750A4',
  secondary: '#3A7BD5',
  tertiary: '#00897B',
};

// Replace Roboto with Inter across the whole MD3 type scale. Passing a flat
// `fontFamily` applies it to every variant while keeping MD3's weights,
// sizes and letter-spacing intact.
const interFonts = configureFonts({
  config: { fontFamily: "'Inter', sans-serif" },
});

/**
 * Build a full react-native-paper MD3 theme from the 3 brand colors.
 * @param {{primary:string, secondary:string, tertiary:string}} brand
 * @param {'light'|'dark'} mode
 */
export function buildTheme(brand, mode) {
  const isDark = mode === 'dark';
  const base = isDark ? MD3DarkTheme : MD3LightTheme;
  const neutral = isDark ? darkNeutral : lightNeutral;

  // MD3 tonal mapping: brand colors lighten in dark mode (tone 80).
  const primary = brandForMode(brand.primary, isDark);
  const secondary = brandForMode(brand.secondary, isDark);
  const tertiary = brandForMode(brand.tertiary, isDark);

  return {
    ...base,
    dark: isDark,
    fonts: interFonts,
    colors: {
      ...base.colors,
      ...neutral,
      // The only brand-driven values:
      primary,
      onPrimary: onColorFor(primary),
      secondary,
      onSecondary: onColorFor(secondary),
      tertiary,
      onTertiary: onColorFor(tertiary),
    },
  };
}
