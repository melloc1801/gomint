import classNames from 'classnames';
import React from 'react';
import { useSlate } from 'slate-react';
import { MarkButtonProps } from '../types';
import { isMarkActive } from '../utils/isMarkActive';
import { toggleMark } from '../utils/toggleMark';

export const MarkButton: React.FC<MarkButtonProps> = ({ format, icon }) => {
  const editor = useSlate();
  const isActive = isMarkActive(editor, format);
  return (
    <button
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
      type="button">
      <i
        className={classNames(
          {
            'text-blue-600': isActive,
          },
          'material-icons'
        )}>
        {icon}
      </i>
    </button>
  );
};
