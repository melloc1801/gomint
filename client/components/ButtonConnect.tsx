import * as React from 'react';

import {
  ArrowLeftIcon,
  ChatBubbleBottomCenterTextIcon,
  RectangleStackIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';

import { Button } from './Button';
import { ConnectButton as CB } from '@rainbow-me/rainbowkit';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { Circle } from './Circle';
import { MenuItemButton } from './MenuItemButton';
import { MenuItemLink } from './MenuItemLink';
import { formatAddress } from '../lib/formatAddress';
import { useAccount } from 'wagmi';
import { useLogin } from '../hooks/login.hook';
import { useLogout } from '../hooks/logout.hook';
import { useProfile } from '../features/profile/hooks/profile.hook.me';

export const ButtonConnect = ({ children = 'Connect wallet' }: { children?: string }) => {
  const login = useLogin();
  const logout = useLogout();
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
                    className="w-full"
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
                    className="transition ease-in-out bg-slate-100 rounded hover:bg-slate-200 px-6 py-2.5 w-full"
                    onClick={openChainModal}
                    type="button">
                    Switch network
                  </button>
                );
              }

              return (
                <Menu as="div" className="relative">
                  <Menu.Button className="inline-flex items-center w-full font-medium text-white transition ease-in-out bg-blue-600 rounded hover:bg-blue-700 px-6 py-2.5">
                    <Circle active />
                    <div className="grow text-start">
                      {profile.isSuccess
                        ? formatAddress(profile.data.address)
                        : account.displayName}
                    </div>
                    <ChevronDownIcon aria-hidden="true" className="w-5 h-5 ml-3 -mr-2 text-white" />
                  </Menu.Button>

                  <Transition
                    as={React.Fragment}
                    leave="transition ease-in duration-75"
                    leaveTo="transform opacity-0 scale-95"
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leaveFrom="transform opacity-100 scale-100">
                    <Menu.Items className="absolute right-0 z-10 w-64 mt-2 font-medium origin-top-right bg-white border divide-y rounded divide-slate-100">
                      <div className="px-1 py-1">
                        <Menu.Item>
                          <MenuItemLink href="/projects" icon={RectangleStackIcon}>
                            Dashboard
                          </MenuItemLink>
                        </Menu.Item>
                      </div>
                      <div className="px-1 py-1">
                        <Menu.Item>
                          <MenuItemLink href="/profile" icon={UserIcon}>
                            Profile
                          </MenuItemLink>
                        </Menu.Item>
                      </div>
                      <div className="px-1 py-1">
                        <Menu.Item>
                          <MenuItemLink
                            target="_blank"
                            href="https://discord.gg/wHcTXH8Kd4"
                            icon={ChatBubbleBottomCenterTextIcon}>
                            Get Help
                          </MenuItemLink>
                        </Menu.Item>
                      </div>

                      <div className="px-1 py-1">
                        <Menu.Item>
                          <MenuItemButton onClick={logout} icon={ArrowLeftIcon}>
                            Logout
                          </MenuItemButton>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              );
            })()}
          </div>
        );
      }}
    </CB.Custom>
  );
};
