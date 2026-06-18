import React from 'react';
import { useTheme } from 'react-native-paper';

/**
 * Two-tone, branding-driven icons.
 *
 * Each icon is drawn with `currentColor`:
 *   - solid `currentColor`               -> the brand PRIMARY tone
 *   - `currentColor` @ fill-opacity 0.2  -> the "surface variant" tone,
 *                                           i.e. 20% of the primary color
 *
 * Because both tones come from a single `color`, the icons restyle themselves
 * with the active branding scheme (and adapt to light/dark automatically).
 *
 * To add the real exported asset, paste its <path> data into a new entry below
 * and mark which parts are the container (variant) vs the glyph (primary).
 */

// Each glyph receives no args; it just uses currentColor / fill-opacity.
const GLYPHS = {
  any_number: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" fill="currentColor" fillOpacity="0.2" />
      <g fill="currentColor">
        <rect x="9.1" y="6.5" width="1.8" height="11" rx="0.9" />
        <rect x="12.9" y="6.5" width="1.8" height="11" rx="0.9" />
        <rect x="6.5" y="9.2" width="11" height="1.8" rx="0.9" />
        <rect x="6.5" y="13" width="11" height="1.8" rx="0.9" />
      </g>
    </>
  ),
  star: (
    <>
      <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.2" />
      <path
        fill="currentColor"
        d="M12 5.2l1.9 3.95 4.35.62-3.15 3.05.75 4.33L12 14.7l-3.6 1.94.75-4.33L6 9.77l4.35-.62L12 5.2z"
      />
    </>
  ),
  bell: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" fill="currentColor" fillOpacity="0.2" />
      <path
        fill="currentColor"
        d="M12 5a3.5 3.5 0 00-3.5 3.5c0 3.5-1.6 4.4-1.6 5.4 0 .4.3.7.8.7h8.6c.5 0 .8-.3.8-.7 0-1-1.6-1.9-1.6-5.4A3.5 3.5 0 0012 5zm0 13.2a1.8 1.8 0 001.8-1.6h-3.6A1.8 1.8 0 0012 18.2z"
      />
    </>
  ),
  heart: (
    <>
      <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.2" />
      <path
        fill="currentColor"
        d="M12 17.6l-1.2-1.1C8 14 6.3 12.4 6.3 10.4c0-1.5 1.1-2.6 2.6-2.6.9 0 1.8.4 2.3 1.1l.8 1 .8-1c.5-.7 1.4-1.1 2.3-1.1 1.5 0 2.6 1.1 2.6 2.6 0 2-1.7 3.6-4.5 6.1L12 17.6z"
      />
    </>
  ),
  shield: (
    <>
      <path
        d="M12 2.5l8 3v5.5c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V5.5l8-3z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path
        fill="currentColor"
        d="M10.6 14.6l-2.7-2.7 1.3-1.3 1.4 1.4 3.9-3.9 1.3 1.3-5.2 5.2z"
      />
    </>
  ),
  bookmark: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" fill="currentColor" fillOpacity="0.2" />
      <path fill="currentColor" d="M9 6h6a1 1 0 011 1v11l-4-2.6L8 18V7a1 1 0 011-1z" />
    </>
  ),
};

export const themedIconNames = Object.keys(GLYPHS);

export function ThemedIcon({ name, size = 48, color }) {
  const theme = useTheme();
  const tint = color || theme.colors.primary;
  const glyph = GLYPHS[name];
  if (!glyph) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color: tint, display: 'block' }}
    >
      {glyph}
    </svg>
  );
}
