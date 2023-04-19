import React from 'react';
import cx from 'classnames';

type TypographyProps = {
  className?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'p' | 'label';
  children: React.ReactNode;
};
export const Typography: React.FC<TypographyProps> = ({
  variant = 'p',
  className = '',
  children,
}) => {
  const h1Styles = 'text-4xl font-extrabold text-blue-1000';
  const h2Styles = 'text-2xl font-bold text-blue-1000';
  const h3Styles = 'text-xl font-semibold  text-blue-1000';

  switch (variant) {
    case 'h1':
      return <h1 className={cx(h1Styles, className)}>{children}</h1>;
    case 'h2':
      return <h2 className={cx(h2Styles, className)}>{children}</h2>;
    case 'h3':
      return <h3 className={cx(h3Styles, className)}>{children}</h3>;
    default:
      return <p className={className}>{children}</p>;
  }
};
