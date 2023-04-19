import fetcher from '../../../lib/fetcher';
import { queryClient } from '../../../pages/_app';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';

// TODO:
// - rename POST /discord-link to /discord/connection
// - rename PATCH /discord-disconnect to DELETE /discord/connection

export const useDiscord = () => {
  const router = useRouter();

  const connect = useMutation(
    () =>
      fetcher<string>({
        method: 'GET',
        url: '/auth/discord-link',
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
        url: '/auth/discord-disconnect',
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('profile');
      },
    }
  );

  return { connect, disconnect };
};
