import { ButtonIcons, ElementTypeEnum, ListTypeEnum, MarkTypeEnum, TextAlignTypes } from './enums';
import { ReactEditor, RenderElementProps } from 'slate-react';

import { BaseEditor } from 'slate';
import { HistoryEditor } from 'slate-history';

export type CustomText = {
  text: string;
  bold?: true;
  italic?: true;
  underline?: true;
};
export type FormatType =
  | ElementTypeEnum
  | ListTypeEnum
  | TextAlignTypes
  | 'image'
  | 'paragraph'
  | 'list-item';
export type MarkButtonProps = { format: MarkTypeEnum; icon: ButtonIcons };
export type BlockButtonProps = { format: FormatType; icon: ButtonIcons };
export type CustomElement = {
  type: FormatType;
  children: CustomText[];
  align?: TextAlignTypes;
};
export type CustomEditorType = BaseEditor & ReactEditor & HistoryEditor;
export type ImageElement = {
  type: 'image';
  url: string;
  children: EmptyText[];
};
export type SlateImageProps = Pick<RenderElementProps, 'attributes'> &
  Pick<RenderElementProps, 'children'> & { element: ImageElement };
export type EmptyText = {
  text: string;
};
declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditorType;
    Element: CustomElement | ImageElement;
    Text: CustomText;
  }
}
