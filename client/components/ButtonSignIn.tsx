import * as React from 'react';

import { Button } from './Button';
import { ConnectButton as CB } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useLogin } from '../hooks/login.hook';
import { useProfile } from '../features/profile/hooks/profile.hook.me';
import { useRouter } from 'next/router';

export const ButtonSignIn = ({
  hidden,
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  hidden?: boolean;
}) => {
  const login = useLogin();
  const router = useRouter();
  const profile = useProfile();
  const { isConnected } = useAccount();
  const [clicked, setClicked] = React.useState(false);

  React.useEffect(() => {
    if (clicked && isConnected && profile.isError) {
      login()
        .then(() => {
          setClicked(false);
        })
        .catch(() => setClicked(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, clicked, profile.isError]);

  return (
    <CB.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
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
              if (!mounted || !account || !chain) {
                return (
                  <Button
                    variant="neutral"
                    className={className}
                    onClick={() => {
                      setClicked(true);
                      openConnectModal();
                    }}>
                    {children}
                  </Button>
                );
              }
              if (hidden) return null;

              return (
                <Button
                  variant="neutral"
                  className={className}
                  onClick={() => {
                    router.push('/projects');
                  }}>
                  {children}
                </Button>
              );
            })()}
          </div>
        );
      }}
    </CB.Custom>
  );
};
