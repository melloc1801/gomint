import cx from 'classnames';
export const PageTitle = ({ children, subtitle }: { children: string; subtitle?: string }) => {
  const classNames = cx('text-2xl font-extrabold text-blue-1000', subtitle ? 'mb-4' : '');
  return (
    <>
      <h1 className={classNames}>{children}</h1>
      {subtitle ? <div>{subtitle}</div> : null}
    </>
  );
};
