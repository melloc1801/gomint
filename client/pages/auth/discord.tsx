import * as React from 'react';

import { SUCCESS_MESSAGES } from '../../lib/handleSuccess';
import fetcher from '../../lib/fetcher';
import { handleErrors } from '../../lib/handleErrors';
import { queryClient } from '../_app';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useProfile } from '../../features/profile/hooks/profile.hook.me';

const DiscordAuth = () => {
  const router = useRouter();
  useProfile({ redirectTo: '/' });

  React.useEffect(() => {
    if (router.query?.state) {
      const state = JSON.parse(router.query.state as string);

      const uuid = state.uuid;
      const code = router.query.code;

      fetcher({ method: 'GET', url: '/auth/discord', params: { code, uuid } })
        .then(() => {
          queryClient.invalidateQueries('profile');
          toast.success(SUCCESS_MESSAGES.DISCORD_VERIFIED);
          router.push(state.client_redirect_uri);
        })
        .catch(async (error) => {
          handleErrors(error);
          setTimeout(() => {
            router.push(state.client_redirect_uri as string);
            queryClient.invalidateQueries('profile');
          }, 3000);
        });
    }
  }, [router]);
  return null;
};

export default DiscordAuth;
