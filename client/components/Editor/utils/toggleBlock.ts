import { CustomEditorType, FormatType } from '../types';
import { Editor, Element, Transforms } from 'slate';
import { ListTypeEnum, TextAlignTypes } from '../types/enums';

import get from 'lodash/get';
import { isBlockActive } from './isBlockActive';

export const toggleBlock = (editor: CustomEditorType, format: FormatType) => {
  const isActive = isBlockActive(editor, format, get(TextAlignTypes, format) ? 'align' : 'type');
  const isList = get(ListTypeEnum, format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      get(ListTypeEnum, n.type) &&
      !get(TextAlignTypes, format),
    split: true,
  });

  let newProperties: Partial<Element>;

  if (format in TextAlignTypes) {
    newProperties = {
      align: isActive ? undefined : (format as TextAlignTypes),
    };
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    };
  }
  Transforms.setNodes<Element>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};
