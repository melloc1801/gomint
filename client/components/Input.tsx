import * as React from 'react';

import { RemoveButton } from './RemoveButton';
import cx from 'classnames';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  prefix?: string;
  onRemove?: () => void;
  icon?: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
};
export const Input: React.FC<InputProps> = ({
  icon,
  error,
  prefix,
  onRemove,
  className,
  disabled,
  ...props
}) => {
  const classNames = cx(
    { 'bg-slate-100': disabled },
    'w-full outline-none placeholder:text-sm placeholder:text-slate-400 p-2.5 rounded',
    className
  );

  const Icon = icon;

  return (
    <div className={className}>
      <div
        className={cx(
          { 'bg-slate-100 opacity-50': disabled, 'border-red-500': error },
          'flex items-center border rounded '
        )}>
        {prefix ? (
          <div className="whitespace-nowrap px-2.5 text-slate-400 text-sm bg-gray-50 self-stretch rounded-l flex items-center">
            {prefix}
          </div>
        ) : null}

        {Icon && !prefix ? (
          <div className="pl-2.5">
            <Icon className="w-5 h-5 text-slate-300" />
          </div>
        ) : null}

        <input {...props} disabled={disabled} className={classNames} />

        {onRemove ? (
          <div className="px-2.5">
            <RemoveButton onClick={onRemove} />
          </div>
        ) : null}
      </div>
      <div className="mb-1 text-xs text-red-500">
        {error ? error : null}
        &nbsp; {/* Empty space to maintain block height */}
      </div>
    </div>
  );
};
