import { CustomEditorType, ImageElement } from '../types';

import { Transforms } from 'slate';

export const insertImage = (editor: CustomEditorType, url: string) => {
  const text = { text: '' };
  const image: ImageElement = { type: 'image', url, children: [text] };
  Transforms.insertNodes(editor, image);
};
