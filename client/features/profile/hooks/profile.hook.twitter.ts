import fetcher from '../../../lib/fetcher';
import { queryClient } from '../../../pages/_app';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';

// TODO:
// - rename POST /twitter-link to /twitter/connection
// - rename PATCH /twitter-disconnect to DELETE /twitter/connection

export const useTwitter = () => {
  const router = useRouter();

  const connect = useMutation(
    () =>
      fetcher<string>({
        method: 'GET',
        url: '/auth/twitter-link',
        params: { client_redirect_uri: router.asPath },
      }),
    {
      onSuccess: (url) => {
        router.push(url);
      },
    }
  );

  const disconnect = useMutation(
    () =>
      fetcher({
        method: 'PATCH',
        url: '/auth/twitter-disconnect',
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('profile');
      },
    }
  );

  return { connect, disconnect };
};
