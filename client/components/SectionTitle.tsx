import cx from 'classnames';

export const SectionTitle = ({
  children,
  subtitle,
  className,
}: {
  children: string;
  className?: string;
  subtitle?: string | JSX.Element;
}) => {
  const classNames = cx(
    'text-2xl font-extrabold text-blue-1000',
    subtitle ? 'mb-4' : '',
    className
  );
  return (
    <>
      <h3 className={classNames}>{children}</h3>
      {subtitle ? <div>{subtitle}</div> : null}
    </>
  );
};
