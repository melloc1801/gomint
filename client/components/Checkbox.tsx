import { CheckIcon } from '@heroicons/react/24/outline';
import React from 'react';
import cx from 'classnames';

type CheckboxType = {
  enabled?: boolean;
  onClick?: () => void;
  children: string;
  disabled?: boolean;
};
export const Checkbox: React.FC<CheckboxType> = ({
  enabled = false,
  onClick,
  children,
  disabled,
}) => {
  return (
    <div
      className={cx(
        'flex items-center cursor-pointer',
        disabled ? 'pointer-events-none text-slate-400' : null
      )}
      onClick={() => (onClick && !disabled ? onClick() : null)}>
      <div
        className={cx(
          { 'bg-blue-600': enabled },
          { 'border-opacity-25': disabled },
          'basis-5 w-5 h-5 rounded-sm mr-3 border border-blue-600 flex items-center justify-center'
        )}>
        <CheckIcon className="w-5 h-5 text-white" />
      </div>
      {children}
    </div>
  );
};
