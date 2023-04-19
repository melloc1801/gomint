import { ReactEditor, useSelected, useSlateStatic } from 'slate-react';

import { RemoveButton } from '../../RemoveButton';
import { SlateImageProps } from '../types';
import { Transforms } from 'slate';
import classNames from 'classnames';

export const SlateImage: React.FC<SlateImageProps> = ({ attributes, children, element }) => {
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);

  const selected = useSelected();

  return (
    <div {...attributes}>
      <>
        {children}
        <div contentEditable={false} className="relative w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="image"
            width="100%"
            height="100%"
            src={element.url}
            className={classNames({ shadow: selected }, 'rounded')}
          />
          <RemoveButton
            className="absolute z-10 top-3 right-4"
            onClick={() => Transforms.removeNodes(editor, { at: path })}
          />
        </div>
      </>
    </div>
  );
};
