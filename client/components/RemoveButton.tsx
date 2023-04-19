import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';

type RemoveButtonProps = {
  className?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};
export const RemoveButton: React.FC<RemoveButtonProps> = ({ className, onClick }) => {
  return (
    <button
      type="button"
      className={classNames(
        'flex justify-center items-center w-6 h-6 rounded-md bg-rose-100 hover:bg-rose-200 active:bg-rose-100',
        className
      )}
      onClick={onClick}>
      <XMarkIcon className="w-3 h-3 text-rose-500 hover:text-rose-600" />
    </button>
  );
};
