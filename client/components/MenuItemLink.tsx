import * as React from 'react';

import Link from 'next/link';

export const MenuItemLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    blank?: boolean;
    icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  }
>((props, ref) => {
  let { href, children, icon, blank, onClick, ...rest } = props;
  const Icon = icon;

  return (
    <div className="p-1">
      <Link href={href || '#'}>
        <a
          ref={ref}
          target={blank ? '_blank' : undefined}
          onClick={(e) => {
            e.stopPropagation();
            onClick ? onClick(e) : null;
          }}
          className="flex items-center w-full px-2 py-2 text-sm no-underline transition ease-in-out rounded-md group hover:bg-slate-50 text-inherit"
          {...rest}>
          <>
            <Icon className="w-5 h-5 mr-3 text-slate-400" aria-hidden="true" />
            {children}
          </>
        </a>
      </Link>
    </div>
  );
});
MenuItemLink.displayName = 'MenuItemLink';
