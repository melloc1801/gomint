import * as React from 'react';

import Link from 'next/link';
import cx from 'classnames';

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: string;
    variant?: 'primary' | 'secondary' | 'neutral' | 'ghost' | 'danger' | 'success' | 'white';
    icon?: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  }
>(({ icon, children, className, variant = 'primary', href, ...props }, ref) => {
  const isGhost = variant === 'ghost';
  const isWhite = variant === 'white';
  const isDanger = variant === 'danger';
  const isPrimary = variant === 'primary';
  const isSuccess = variant === 'success';
  const isNeutral = variant === 'neutral';
  const isSecondary = variant === 'secondary';

  const classNames = cx(
    {
      'bg-white hover:bg-blue-50 active:bg-white text-blue-600 border border-white': isWhite,
      'bg-blue-600 hover:bg-blue-700 active:bg-blue-600 text-white transition ease-in-out border border-blue-600':
        isPrimary,
      'bg-red-500 hover:bg-red-600 active:bg-red-500 text-white transition ease-in-out border border-red-500':
        isDanger,
      'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-500 text-white transition ease-in-out border border-emerald-500':
        isSuccess,
      'bg-orange-400 hover:bg-orange-500 active:bg-orange-400 text-white transition ease-in-out border border-orange-400':
        isSecondary,
      'border border-blue-600 text-blue-600 hover:bg-blue-100 hover:bg-opacity-50 active:text-blue-600 hover:border-blue-700 active:border-blue-600 transition ease-in-out':
        isNeutral,
      'opacity-25 cursor-default': props.disabled,
      'text-blue-1000': isGhost,
    },
    'rounded font-medium text-center px-7 py-2.5 transition ease-in-out disabled:pointer-events-none',
    {
      [children ? '!pl-4 !pr-5' : 'px-3']: icon,
    },
    className
  );

  const Icon = icon;

  if (href) {
    return (
      <Link href={href} passHref>
        <button type="button" className={classNames} {...props} ref={ref}>
          <a
            className={cx(
              'flex items-center justify-center no-underline hover:no-underline text-inherit'
            )}>
            {Icon ? <Icon className={cx('w-6', children ? 'mr-2' : '')} /> : null} {children}
          </a>
        </button>
      </Link>
    );
  }

  return (
    <button type="button" className={classNames} {...props} ref={ref}>
      <span className="flex items-center justify-center">
        <>
          {Icon ? <Icon className={cx('w-5', children ? 'mr-2' : '')} /> : null} {children}
        </>
      </span>
    </button>
  );
});

Button.displayName = 'Button';
