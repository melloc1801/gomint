import cx from 'classnames';

type RequirementButtonProps = {
  children: string;
  onclick: () => void;
  variant: 'discord' | 'twitter' | 'email';
};

export const RequirementButton = ({ variant, children, onclick }: RequirementButtonProps) => {
  const isEmailButton = variant === 'email';
  const isDiscordButton = variant === 'discord';
  const isTwitterButton = variant === 'twitter';

  return (
    <div
      onClick={onclick}
      className={cx(
        {
          'bg-gomint-discord text-white': isDiscordButton,
          'bg-gomint-twitter text-white': isTwitterButton,
          'bg-gomint-grey text-white': isEmailButton,
        },
        'inline-block px-2 max-h-6 py-1 text-xs font-medium rounded  hover:cursor-pointer'
      )}>
      {children}
    </div>
  );
};
