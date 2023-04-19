import * as React from 'react';

import cx from 'classnames';

export const MenuItemButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
    iconClassName?: string;
  }
>((props, ref) => {
  let { children, icon, iconClassName, onClick, className, ...rest } = props;
  const Icon = icon;

  const iconClassNames = cx('w-5 h-5 mr-3 text-slate-400', iconClassName);

  return (
    <div className="p-1">
      <button
        ref={ref}
        onClick={(e) => {
          e.stopPropagation();
          onClick ? onClick(e) : null;
        }}
        className={cx(
          'flex  text-sm items-center w-full px-2 py-2 transition ease-in-out rounded-md hover:bg-slate-50 cursor-pointer',
          className
        )}
        {...rest}>
        <>
          <Icon className={iconClassNames} aria-hidden="true" />
          {children}
        </>
      </button>
    </div>
  );
});
MenuItemButton.displayName = 'MenuItemButton';
