import * as React from 'react';

import { Button } from './Button';
import { ConnectButton as CB } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useLogin } from '../hooks/login.hook';
import { usePremium } from '../hooks/premium.hook';
import { useProfile } from '../features/profile/hooks/profile.hook.me';

export const ButtonBuyNow = () => {
  const login = useLogin();
  const profile = useProfile();
  const { buy } = usePremium();
  const { isConnected } = useAccount();
  const [clicked, setClicked] = React.useState(false);

  React.useEffect(() => {
    if (clicked && isConnected && profile.isError) {
      login()
        .then(() => {
          buy();
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
              if (chain?.unsupported) {
                return null;
              }

              const notLoggedIn = !mounted || !account || !chain;

              const loginAndBuy = () => {
                setClicked(true);
                openConnectModal();
              };

              return (
                <Button
                  variant="white"
                  className="py-3 font-medium"
                  onClick={() => (notLoggedIn ? loginAndBuy() : buy())}>
                  Buy Now
                </Button>
              );
            })()}
          </div>
        );
      }}
    </CB.Custom>
  );
};
