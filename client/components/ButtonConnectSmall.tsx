import * as React from 'react';

import { Button } from './Button';
import { ConnectButton as CB } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useLogin } from '../hooks/login.hook';
import { useProfile } from '../features/profile/hooks/profile.hook.me';

export const ButtonConnectSmall = ({ children }: { children: React.ReactNode }) => {
  const login = useLogin();
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
      {({ account, chain, openChainModal, openConnectModal, mounted }) => {
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
                    variant="secondary"
                    className="!px-2 !py-1 text-xs font-medium rounded hover:cursor-pointer"
                    onClick={() => {
                      setClicked(true);
                      openConnectModal();
                    }}>
                    {children}
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    className="!px-2 !py-1 text-xs font-medium rounded hover:cursor-pointer"
                    onClick={openChainModal}
                    type="button">
                    Switch network
                  </button>
                );
              }

              return null;
            })()}
          </div>
        );
      }}
    </CB.Custom>
  );
};
