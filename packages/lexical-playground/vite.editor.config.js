/**
 * Copyright (c) Bitbriks, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {defineConfig} from 'vite';
import viteProdConfig from './vite.prod.config';

// https://vitejs.dev/config/
export default defineConfig({
  ...viteProdConfig,
  build: {
    ...viteProdConfig.build,
    outDir: 'dist',
    lib: {
      name: 'bitbriks-editor',
      entry: './src/BitbrikEditor.tsx',
      formats: ['es', 'cjs']
    },
    rollupOptions: {}
  }
});
