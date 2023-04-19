import * as React from 'react';

import { SUCCESS_MESSAGES } from '../../lib/handleSuccess';
import fetcher from '../../lib/fetcher';
import { handleErrors } from '../../lib/handleErrors';
import { queryClient } from '../_app';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useProfile } from '../../features/profile/hooks/profile.hook.me';

const TwitterAuth = () => {
  const router = useRouter();
  useProfile({ redirectTo: '/' });

  React.useEffect(() => {
    if (router.query) {
      const { client_redirect_uri, oauth_verifier, oauth_token } = router.query;
      const hasAllParamsForRequest = client_redirect_uri && oauth_token && oauth_verifier;

      if (hasAllParamsForRequest) {
        fetcher({
          method: 'GET',
          url: '/auth/twitter',
          params: { oauth_token, oauth_verifier },
        })
          .then(() => {
            queryClient.invalidateQueries('profile');
            toast.success(SUCCESS_MESSAGES.TWITTER_VERIFIED);
            router.push(client_redirect_uri as string);
          })
          .catch((error) => {
            handleErrors(error);
            setTimeout(() => {
              queryClient.invalidateQueries('profile');
              router.push(router.query.client_redirect_uri as string);
            }, 3000);
          });
      }
    }
  }, [router]);
  return null;
};

export default TwitterAuth;
