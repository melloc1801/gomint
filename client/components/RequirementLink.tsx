import cx from 'classnames';

type RequirementLinkProps = {
  children: string;
  href: string;
  className?: string;
  variant: 'discord' | 'twitter' | 'collection';
};

export const RequirementLink = ({ children, href, className, variant }: RequirementLinkProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cx('hover:underline hover:cursor-pointer no-underline', className, {
        'text-gomint-discord': variant === 'discord',
        'text-gomint-twitter': variant === 'twitter',
        'text-gomint-blue': variant === 'collection',
      })}>
      {children}
    </a>
  );
};
