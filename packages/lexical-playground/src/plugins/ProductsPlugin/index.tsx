/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$wrapNodeInElement} from '@lexical/utils';
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from 'lexical';
import {useEffect} from 'react';

// import * as React from 'react';
import {
  $createProductsNode,
  Products,
  ProductsNode,
} from '../../nodes/ProductsNode';

export const INSERT_PRODUCTS_COMMAND: LexicalCommand<Products> = createCommand(
  'INSERT_PRODUCTS_COMMAND',
);

export default function ProductsPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (!editor.hasNodes([ProductsNode])) {
      throw new Error('ProductsPlugin: ProductsNode not registered on editor');
    }

    return editor.registerCommand<Products>(
      INSERT_PRODUCTS_COMMAND,
      (payload) => {
        const productsNode = $createProductsNode(payload);
        $insertNodes([productsNode]);
        if ($isRootOrShadowRoot(productsNode.getParentOrThrow())) {
          $wrapNodeInElement(productsNode, $createParagraphNode).selectEnd();
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);
  return null;
}
