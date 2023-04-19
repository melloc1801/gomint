import cx from 'classnames';

export const Header = ({
  children,
  className,
}: {
  children: JSX.Element[];
  className?: string;
}) => {
  const classNames = cx(
    'flex items-center justify-between px-8 py-4 shadow-md shadow-slate-200',
    className
  );

  return <header className={classNames}>{children}</header>;
};
