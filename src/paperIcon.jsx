import React from 'react';
import { Text } from 'react-native';
import glyphMap from 'react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';

/**
 * Paper 5.15's default icon loader uses require() (no runtime `require` in the
 * browser), so it falls back to a "□". We supply our own icon instead.
 *
 * We deliberately do NOT import 'react-native-vector-icons/MaterialCommunityIcons'
 * because that pulls in create-icon-set.js, which contains JSX inside a .js file
 * that Rollup (vite build) cannot parse. Instead we use only the JSON glyph map
 * and render the glyph with a Text in the bundled MaterialCommunityIcons font
 * (see fonts.css). Pure-JSON import → builds cleanly on CI.
 *
 * Pass this to every <PaperProvider settings={paperSettings}>.
 */
function MdiIcon({ name, color, size = 24 }) {
  const code = glyphMap[name];
  const glyph = typeof code === 'number' ? String.fromCodePoint(code) : '';
  return (
    <Text
      selectable={false}
      style={{
        fontFamily: 'MaterialCommunityIcons',
        fontSize: size,
        lineHeight: size,
        color,
      }}
    >
      {glyph}
    </Text>
  );
}

export const paperSettings = {
  icon: ({ name, color, size }) => <MdiIcon name={name} color={color} size={size} />,
};
