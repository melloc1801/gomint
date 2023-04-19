import cx from 'classnames';
import { usePremium } from '../hooks/premium.hook';

type Props = {
  title?: string;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
};
export const PremiumOverlay = ({
  children,
  disabled,
  loading,
  title = 'Premium tier only.',
}: Props) => {
  const { buy } = usePremium();
  const classNames = cx(
    {
      invisible: loading,
      'min-h-[100px]': !disabled,
    },
    'relative'
  );

  if (disabled) {
    return <div className={classNames}>{children}</div>;
  }

  return (
    <div className={classNames}>
      {children}
      <div className="absolute top-0 flex items-center justify-center w-full h-full text-sm bg-white border border-blue-300 border-dashed rounded">
        <div className="p-2 leading-6 text-center">
          <span>{title}</span>
          <button
            type="button"
            className="pl-1 text-blue-500 underline hover:no-underline"
            onClick={() => buy()}>
            Buy premium
          </button>
        </div>
      </div>
    </div>
  );
};
