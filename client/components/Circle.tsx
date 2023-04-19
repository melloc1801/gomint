import cx from 'classnames';

export const Circle = ({ className, active }: { className?: string; active?: boolean }) => {
  const classNames = cx(
    'w-2.5 h-2.5 mr-3 -ml-1',
    active ? 'fill-gomint-green' : 'fill-gomint-grey',
    className
  );

  return (
    <svg viewBox="0 0 10 10" className={classNames} xmlns="http://www.w3.org/2000/svg">
      <circle cx="5" cy="5" r="5" />
    </svg>
  );
};
