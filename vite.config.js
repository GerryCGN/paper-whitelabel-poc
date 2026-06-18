import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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
      alias: {
        'react-native': 'react-native-web',
      },
      extensions: ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', '.js', '.jsx', '.ts', '.tsx', '.json'],
    },
    optimizeDeps: {
      include: [
        'react-native-web',
        'react-native-paper',
        'react-native-vector-icons',
        'react-native-vector-icons/MaterialCommunityIcons',
      ],
      esbuildOptions: {
        resolveExtensions: ['.web.js', '.js', '.jsx', '.ts', '.tsx'],
        loader: { '.js': 'jsx' },
      },
    },
  };
});
