import React from 'react';
import cx from 'classnames';

type RequirementProps = {
  className?: string;
  variant: 'common' | 'discord' | 'twitter' | 'collection';
  title: { text: string; icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element };
  children: React.ReactNode;
};
export const Requirement: React.FC<RequirementProps> = (props) => {
  const { title, variant, children } = props;

  const isCommon = variant === 'common';
  const isDiscord = variant === 'discord';
  const isTwitter = variant === 'twitter';
  const isCollection = variant === 'collection';

  const iconStyles = 'w-4 h-4 mr-1.5';
  const titleStyles = 'absolute flex items-center px-2 text-sm font-semibold';

  const Icon = title.icon;

  return (
    <div
      className={cx(
        {
          'bg-gomint-requirement-discord-bg border-gomint-requirement-discord-border': isDiscord,
          'bg-gomint-requirement-common-bg border-gomint-requirement-common-border': isCommon,
          'bg-gomint-requirement-twitter-bg border-gomint-requirement-twitter-border': isTwitter,
          'bg-gomint-requirement-collection-bg border-gomint-requirement-collection-border':
            isCollection,
        },
        'relative rounded min-h-14 border border-solid shadow shadow-slate-100'
      )}>
      <div className={cx(titleStyles, 'text-white bg-white select-none -top-5 left-5')}>
        <Icon className={iconStyles} />
        {title.text}
      </div>

      <div
        className={cx(titleStyles, '-top-2.5 left-5', {
          'text-gomint-orange': isCommon,
          'text-gomint-discord': isDiscord,
          'text-gomint-twitter': isTwitter,
          'text-gomint-blue': isCollection,
        })}>
        <Icon className={iconStyles} />
        {title.text}
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
};
