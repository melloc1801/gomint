import React from 'react';
import cx from 'classnames';

export const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const classNames = cx('p-5 md:px-10 md:pb-6 border rounded md:pt-7 border-slate-200', className);
  return <div className={classNames}>{children}</div>;
};
