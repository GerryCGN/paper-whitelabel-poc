import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

/**
 * Paper 5.15's default icon loader uses require() in try/catch to find an icon
 * library, which doesn't work in a browser/Vite (no runtime `require`), so it
 * falls back to rendering a "□" with no icon font. We bypass that by giving
 * PaperProvider an explicit icon component, imported via ESM so Vite bundles it.
 *
 * On web, react-native-vector-icons renders the glyph with font-family
 * 'MaterialCommunityIcons', which matches the @font-face in fonts.css.
 *
 * Pass this to every <PaperProvider settings={paperSettings}>.
 */
export const paperSettings = {
  icon: ({ direction, ...props }) => <MaterialCommunityIcons {...props} />,
};
