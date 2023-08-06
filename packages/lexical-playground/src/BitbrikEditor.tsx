/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import './index.css';
import './bitbriks.css';

import {$insertGeneratedNodes} from '@lexical/clipboard';
import {$generateHtmlFromNodes, $generateNodesFromDOM} from '@lexical/html';
import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {CheckListPlugin} from '@lexical/react/LexicalCheckListPlugin';
import LexicalClickableLinkPlugin from '@lexical/react/LexicalClickableLinkPlugin';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {HorizontalRulePlugin} from '@lexical/react/LexicalHorizontalRulePlugin';
import {ListPlugin} from '@lexical/react/LexicalListPlugin';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {TabIndentationPlugin} from '@lexical/react/LexicalTabIndentationPlugin';
import {TablePlugin} from '@lexical/react/LexicalTablePlugin';
import useLexicalEditable from '@lexical/react/useLexicalEditable';
import {INSERT_TABLE_COMMAND} from '@lexical/table';
import {$createRangeSelection, FORMAT_ELEMENT_COMMAND} from 'lexical';
import * as React from 'react';
import {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {CAN_USE_DOM} from 'shared/canUseDOM';

import {SettingsContext, useSettings} from './context/SettingsContext';
import {SharedAutocompleteContext} from './context/SharedAutocompleteContext';
import {
  SharedHistoryContext,
  useSharedHistoryContext,
} from './context/SharedHistoryContext';
import PlaygroundNodes from './nodes/BitbrikNodes';
import TableCellNodes from './nodes/BitbrikTableCellNodes';
import {Products} from './nodes/ProductsNode';
import AutocompletePlugin from './plugins/AutocompletePlugin';
import AutoEmbedPlugin from './plugins/AutoEmbedPlugin';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import CollapsiblePlugin from './plugins/CollapsiblePlugin';
import DragDropPaste from './plugins/DragDropPastePlugin';
import DraggableBlockPlugin from './plugins/DraggableBlockPlugin';
import EmojiPickerPlugin from './plugins/EmojiPickerPlugin';
import EmojisPlugin from './plugins/EmojisPlugin';
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin/bitbriks';
import FloatingTextFormatToolbarPlugin from './plugins/FloatingTextFormatToolbarPlugin/bitbriks';
import ImagesPlugin from './plugins/ImagesPlugin';
import LinkPlugin from './plugins/LinkPlugin';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';
import ProductsPlugin, {
  INSERT_PRODUCTS_COMMAND,
} from './plugins/ProductsPlugin';
import TabFocusPlugin from './plugins/TabFocusPlugin';
import TableCellActionMenuPlugin from './plugins/TableActionMenuPlugin';
import TableCellResizer from './plugins/TableCellResizer';
import TableOfContentsPlugin from './plugins/TableOfContentsPlugin';
import {
  TableContext,
  TablePlugin as NewTablePlugin,
} from './plugins/TablePlugin';
// import ToolbarPlugin from './plugins/ToolbarPlugin/bitbriks';
import YouTubePlugin from './plugins/YouTubePlugin';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';
import ContentEditable from './ui/ContentEditable';
import Placeholder from './ui/Placeholder';

function Editor(): JSX.Element {
  const {historyState} = useSharedHistoryContext();
  const {
    settings: {
      isAutocomplete,
      showTableOfContents,
      tableCellMerge,
      tableCellBackgroundColor,
    },
  } = useSettings();
  const isEditable = useLexicalEditable();
  const text = 'Enter some rich text...';
  const placeholder = <Placeholder>{text}</Placeholder>;
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isSmallWidthViewport, setIsSmallWidthViewport] =
    useState<boolean>(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const cellEditorConfig = {
    namespace: 'Playground',
    nodes: [...TableCellNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };

  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport =
        CAN_USE_DOM && window.matchMedia('(max-width: 1025px)').matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };
    updateViewPortWidth();
    window.addEventListener('resize', updateViewPortWidth);

    return () => {
      window.removeEventListener('resize', updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);

  return (
    <>
      <div className={`editor-container bitbrik-editor`}>
        <DragDropPaste />
        <AutoFocusPlugin />
        <EmojiPickerPlugin />
        <AutoEmbedPlugin />
        <EmojisPlugin />
        <AutoLinkPlugin />
        <>
          <HistoryPlugin externalHistoryState={historyState} />
          <RichTextPlugin
            contentEditable={
              <div className="editor-scroller">
                <div className="editor" ref={onRef}>
                  <ContentEditable />
                </div>
              </div>
            }
            placeholder={placeholder}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <ListPlugin />
          <CheckListPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <TablePlugin
            hasCellMerge={tableCellMerge}
            hasCellBackgroundColor={tableCellBackgroundColor}
          />
          <TableCellResizer />
          <NewTablePlugin cellEditorConfig={cellEditorConfig}>
            <AutoFocusPlugin />
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="TableNode__contentEditable" />
              }
              placeholder={null}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <ImagesPlugin captionsEnabled={false} />
            <LinkPlugin />
            <LexicalClickableLinkPlugin />
            <FloatingTextFormatToolbarPlugin />
          </NewTablePlugin>
          <ImagesPlugin />
          <LinkPlugin />
          <ProductsPlugin />
          <YouTubePlugin />
          {!isEditable && <LexicalClickableLinkPlugin />}
          <HorizontalRulePlugin />
          <TabFocusPlugin />
          <TabIndentationPlugin />
          <CollapsiblePlugin />
          {floatingAnchorElem && !isSmallWidthViewport && (
            <>
              <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
              <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
              <TableCellActionMenuPlugin
                anchorElem={floatingAnchorElem}
                cellMerge={true}
              />
              <FloatingTextFormatToolbarPlugin
                anchorElem={floatingAnchorElem}
              />
            </>
          )}
        </>

        {isAutocomplete && <AutocompletePlugin />}
        <div>{showTableOfContents && <TableOfContentsPlugin />}</div>
      </div>
      {/* <ToolbarPlugin /> */}
    </>
  );
}

type BitbrikEditorProps = {
  initialHtml: string;
};

const App = forwardRef(function (
  {initialHtml}: BitbrikEditorProps,
  ref,
): JSX.Element {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (initialHtml) {
      editor.update(
        () => {
          const parser = new DOMParser();
          const dom = parser.parseFromString(initialHtml, 'text/html');
          const nodes = $generateNodesFromDOM(editor, dom);
          $insertGeneratedNodes(editor, nodes, $createRangeSelection());
        },
        {
          tag: 'init',
        },
      );
    }
  }, [initialHtml, editor]);

  useImperativeHandle(ref, () => {
    return {
      exportHtml: () => {
        return new Promise((resolve) => {
          editor.update(() => {
            const htmlContent = $generateHtmlFromNodes(editor);
            resolve(htmlContent);
          });
        });
      },
      insertProducts: (products: Products) => {
        editor.dispatchCommand(INSERT_PRODUCTS_COMMAND, products);
        // center the product block
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
      },
      insertTable: () => {
        editor.dispatchCommand(INSERT_TABLE_COMMAND, {
          columns: '5',
          rows: '5',
        });
      },
    };
  });

  return (
    <SharedHistoryContext>
      <TableContext>
        <SharedAutocompleteContext>
          <div className="editor-shell">
            <Editor />
          </div>
        </SharedAutocompleteContext>
      </TableContext>
    </SharedHistoryContext>
  );
});

export const BitbrikEditor = forwardRef(function (
  {initialHtml}: BitbrikEditorProps,
  ref,
): JSX.Element {
  const initialConfig = {
    namespace: 'Playground',
    nodes: [...PlaygroundNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <SettingsContext>
        <App initialHtml={initialHtml} ref={ref} />
      </SettingsContext>
    </LexicalComposer>
  );
});
