import * as React from 'react';

import Router from 'next/router';
import fetcher from '../../../lib/fetcher';
import { useDisconnect } from 'wagmi';
import { useQuery } from 'react-query';

type Wallet = {
  label: string;
  address: string;
};

type Profile = {
  nonce: string;
  email?: string;
  address: string;
  premium: boolean;
  username: string;
  wallets: Wallet[];
  emailAuthorized: boolean;
  canCreateProject: boolean;
  discordAuthorized: boolean;
  twitterAuthorized: boolean;
};

export function useProfile({
  redirectTo = '',
  redirectIfFound = false,
  redirectToReferrer = false,
} = {}) {
  const query = useQuery(
    'profile',
    () =>
      fetcher<Profile>({
        method: 'GET',
        url: '/me',
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );

  const { disconnect } = useDisconnect();

  React.useEffect(() => {
    if (query.isError) {
      disconnect();
    }
  }, [query.isError, disconnect]);

  React.useEffect(() => {
    const hasRedirect =
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && query.isError) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && query.isSuccess);

    if (hasRedirect && redirectTo) {
      Router.push(redirectTo);
    }

    if (hasRedirect && redirectToReferrer) {
      const storage = window?.sessionStorage;
      if (!storage) return;

      Router.push(storage.getItem('prevPath') || 'projects');
    }
  }, [query.isSuccess, query.isError, redirectIfFound, redirectTo, redirectToReferrer]);

  return query;
}
