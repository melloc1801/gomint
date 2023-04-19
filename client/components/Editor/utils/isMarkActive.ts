import get from 'lodash/get';
import { Editor } from 'slate';
import { CustomEditorType } from '../types';
import { MarkTypeEnum } from '../types/enums';

export const isMarkActive = (editor: CustomEditorType, format: MarkTypeEnum) =>
  Boolean(get(Editor.marks(editor), format));
