import * as React from 'react';

import { Button } from './Button';
import { ConnectButton as CB } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useLogin } from '../hooks/login.hook';
import { useProfile } from '../features/profile/hooks/profile.hook.me';
import { useRouter } from 'next/router';
import cx from 'classnames';

type ButtonTryForFreeProps = {
  variant?: 'primary' | 'secondary';
};
export const ButtonTryForFree: React.FC<ButtonTryForFreeProps> = ({ variant = 'primary' }) => {
  const login = useLogin();
  const router = useRouter();
  const profile = useProfile();
  const { isConnected } = useAccount();
  const [clicked, setClicked] = React.useState(false);

  const primaryStyles = 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white';
  const secondaryStyles = 'bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-600';

  React.useEffect(() => {
    if (clicked && isConnected && profile.isError) {
      login().catch(() => setClicked(false));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, clicked, profile.isError, router]);

  React.useEffect(() => {
    if (clicked && isConnected && profile.isSuccess) {
      router.push('/projects');
      setClicked(false);
    }
  }, [isConnected, clicked, profile.isSuccess, router]);

  return (
    <CB.Custom>
      {({ openConnectModal, mounted }) => {
        return (
          <div
            {...(!mounted && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                userSelect: 'none',
                pointerEvents: 'none',
              },
            })}>
            {(() => {
              return (
                <Button
                  onClick={() => {
                    setClicked(true);
                    openConnectModal();
                  }}
                  className={cx(
                    {
                      [primaryStyles]: variant === 'primary',
                      [secondaryStyles]: variant === 'secondary',
                    },
                    'px-16 animate-blue-shadow-pulse shadow-blue-300 ease-pulse'
                  )}>
                  Get started
                </Button>
              );
            })()}
          </div>
        );
      }}
    </CB.Custom>
  );
};
