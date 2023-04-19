import { Editor } from 'slate';
import { CustomEditorType } from '../types';
import { MarkTypeEnum } from '../types/enums';
import { isMarkActive } from './isMarkActive';

export const toggleMark = (editor: CustomEditorType, format: MarkTypeEnum) => {
  if (isMarkActive(editor, format)) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};
