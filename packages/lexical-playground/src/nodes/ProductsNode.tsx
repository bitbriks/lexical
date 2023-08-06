/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';
import * as React from 'react';
import {Suspense} from 'react';

export type Products = ReadonlyArray<Product>;

export type Product = Readonly<{
  name: string;
  id: string;
  image: string;
  url: string;
}>;

const ProductsComponent = React.lazy(
  // @ts-ignore
  () => import('./ProductsComponent'),
);

export type SerializedProductsNode = Spread<
  {
    products: Products;
  },
  SerializedLexicalNode
>;

function convertProductsElement(
  domNode: HTMLElement,
): DOMConversionOutput | null {
  const products = domNode.getAttribute('data-lexical-products');
  if (products !== null) {
    const node = $createProductsNode(JSON.parse(products));
    return {node};
  }
  return null;
}

export class ProductsNode extends DecoratorNode<JSX.Element> {
  __products: Products;

  static getType(): string {
    return 'products';
  }

  static clone(node: ProductsNode): ProductsNode {
    return new ProductsNode(node.__products, node.__key);
  }

  static importJSON(serializedNode: SerializedProductsNode): ProductsNode {
    const node = $createProductsNode(serializedNode.products);
    // serializedNode.options.forEach(node.addOption);
    return node;
  }

  constructor(products: Products, key?: NodeKey) {
    super(key);
    this.__products = products;
  }

  exportJSON(): SerializedProductsNode {
    return {
      products: this.__products,
      type: 'products',
      version: 1,
    };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-products')) {
          return null;
        }
        return {
          conversion: convertProductsElement,
          priority: 2,
        };
      },
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('span');
    element.setAttribute(
      'data-lexical-products',
      JSON.stringify(this.__products),
    );
    return {element};
  }

  createDOM(): HTMLElement {
    const elem = document.createElement('span');
    elem.style.display = 'block';
    return elem;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    return (
      <Suspense fallback={null}>
        <ProductsComponent products={this.__products} nodeKey={this.__key} />
      </Suspense>
    );
  }
}

export function $createProductsNode(products: Products): ProductsNode {
  return new ProductsNode(products);
}

export function $isProductsNode(
  node: LexicalNode | null | undefined,
): node is ProductsNode {
  return node instanceof ProductsNode;
}
