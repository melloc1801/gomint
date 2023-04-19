import get from 'lodash/get';
import { Editor, Element } from 'slate';
import { CustomEditorType, FormatType } from '../types';

export const isBlockActive = (editor: CustomEditorType, format: FormatType, blockType = 'type') => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => !Editor.isEditor(n) && Element.isElement(n) && get(n, blockType) === format,
    })
  );

  return Boolean(match);
};
