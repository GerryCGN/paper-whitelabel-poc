import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const mdiShim = fileURLToPath(new URL('./src/paperIcon.jsx', import.meta.url));

// react-native-paper / react-native-web ship some untranspiled .js with JSX/flow.
// We alias react-native -> react-native-web and tell esbuild to treat .js as jsx.
export default defineConfig(({ command }) => {
  const isBuild = command === 'build';
  return {
    // Relative base so the production build also works when served from a
    // subpath like https://<user>.github.io/<repo>/ (GitHub Pages project site).
    base: isBuild ? './' : '/',
    plugins: [react()],
    define: {
      global: 'window',
      __DEV__: isBuild ? 'false' : 'true',
      'process.env.NODE_ENV': JSON.stringify(isBuild ? 'production' : 'development'),
    },
    resolve: {
      alias: [
        // Redirect Paper's internal MaterialCommunityIcon (used directly by
        // Appbar.BackAction, the selected Chip check, ...) to our inline-SVG
        // renderer so those icons render without the icon font.
        { find: /^\.\.?\/MaterialCommunityIcon$/, replacement: mdiShim },
        { find: 'react-native', replacement: 'react-native-web' },
      ],
      extensions: ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', '.js', '.jsx', '.ts', '.tsx', '.json'],
    },
    optimizeDeps: {
      // react-native-paper is intentionally NOT pre-bundled: esbuild's
      // pre-bundling ignores our regex alias for MaterialCommunityIcon, so we
      // let Vite's normal resolver handle Paper (alias applies in dev + build).
      include: ['react-native-web', '@mdi/js'],
      exclude: ['react-native-paper'],
      esbuildOptions: {
        resolveExtensions: ['.web.js', '.js', '.jsx', '.ts', '.tsx'],
        loader: { '.js': 'jsx' },
      },
    },
  };
});
