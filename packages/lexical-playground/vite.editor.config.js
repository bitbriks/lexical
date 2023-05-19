/**
 * Copyright (c) Bitbriks, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {defineConfig} from 'vite';
import viteProdConfig from './vite.prod.config';
import {resolve} from 'path';
import path from 'path';

const externals = [
  'react',
  'react-dom',
  'lexical',
  '@lexical/react'
];

[
  'LexicalTreeView',
  'LexicalComposer',
  'LexicalComposerContext',
  'useLexicalIsTextContentEmpty',
  'useLexicalTextEntity',
  'useLexicalSubscription',
  'useLexicalEditable',
  'LexicalContentEditable',
  'LexicalNestedComposer',
  'LexicalHorizontalRuleNode',
  'LexicalHorizontalRulePlugin',
  'LexicalDecoratorBlockNode',
  'LexicalBlockWithAlignableContents',
  'useLexicalNodeSelection',
  'LexicalMarkdownShortcutPlugin',
  'LexicalCharacterLimitPlugin',
  'LexicalHashtagPlugin',
  'LexicalErrorBoundary',
  'LexicalPlainTextPlugin',
  'LexicalRichTextPlugin',
  'LexicalClearEditorPlugin',
  'LexicalClickableLinkPlugin',
  'LexicalCollaborationContext',
  'LexicalCollaborationPlugin',
  'LexicalHistoryPlugin',
  'LexicalTypeaheadMenuPlugin',
  'LexicalNodeMenuPlugin',
  'LexicalTablePlugin',
  'LexicalLinkPlugin',
  'LexicalListPlugin',
  'LexicalCheckListPlugin',
  'LexicalAutoFocusPlugin',
  "LexicalTableOfContents",
  'LexicalAutoLinkPlugin',
  'LexicalAutoEmbedPlugin',
  'LexicalOnChangePlugin',
  'LexicalNodeEventPlugin',
  'LexicalTabIndentationPlugin',
].forEach((module) => {
  externals.push(`@lexical/react/${module}`);
});

[
  'clipboard',
  'selection',
  'text',
  'headless',
  'html',
  'hashtag',
  'history',
  'list',
  'file',
  'table',
  'offset',
  'utils',
  'code',
  'plain-text',
  'rich-text',
  'dragon',
  'link',
  'overflow',
  'markdown',
  'mark',
  'yjs'
].forEach(module => {
  externals.push(`@lexical/${module}`);
})

const moduleResolution = [
  {
    find: 'shared',
    replacement: path.resolve('../shared/src'),
  },
];
// https://vitejs.dev/config/
export default defineConfig({
  ...viteProdConfig,
  resolve: {
    alias: moduleResolution
  },
  build: {
    ...viteProdConfig.build,
    outDir: 'dist',
    lib: {
      name: 'bitbriks-editor',
      entry: './src/BitbrikEditor.tsx',
      formats: ['es']
    },
    rollupOptions: {
      external: externals
    }
    /*
    rollupOptions: {
      output: {
        manualChunks: () => "everything.js"
      }
    }
    */
  }
});
