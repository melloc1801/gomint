import classNames from 'classnames';
import get from 'lodash/get';
import { useSlate } from 'slate-react';
import { BlockButtonProps } from '../types';
import { TextAlignTypes } from '../types/enums';
import { isBlockActive } from '../utils/isBlockActive';
import { toggleBlock } from '../utils/toggleBlock';

export const BlockButton: React.FC<BlockButtonProps> = ({ format, icon }) => {
  const editor = useSlate();
  const isActive = isBlockActive(editor, format, get(TextAlignTypes, format) ? 'align' : 'type');

  return (
    <button
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
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
