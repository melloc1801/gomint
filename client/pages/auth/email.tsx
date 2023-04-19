import * as React from 'react';

import { SUCCESS_MESSAGES } from '../../lib/handleSuccess';
import fetcher from '../../lib/fetcher';
import { queryClient } from '../_app';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useProfile } from '../../features/profile/hooks/profile.hook.me';

const EmailVerify = () => {
  const router = useRouter();
  useProfile({ redirectTo: '/' });

  React.useEffect(() => {
    const code = router.query?.code;

    if (code) {
      fetcher({
        method: 'POST',
        params: { code },
        url: '/user/email/verification',
      }).then(() => {
        router.push('/profile');
        toast.success(SUCCESS_MESSAGES.EMAIL_VERIFIED);
        queryClient.invalidateQueries('profile');
      });
    }
  }, [router]);
  return null;
};

export default EmailVerify;
