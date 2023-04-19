import fetcher from '../../../lib/fetcher';
import { queryClient } from '../../../pages/_app';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import { handleErrors } from '../../../lib/handleErrors';
import { AxiosError } from 'axios';

export const useUser = () => {
  const router = useRouter();

  const update = useMutation<string, AxiosError, { email?: string; username?: string }>(
    ({ email, username }) =>
      fetcher({
        method: 'PATCH',
        url: '/user',
        data: { email, username },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['profile']);
        router.push('/projects');
      },
      onError: (error) => {
        handleErrors(error);
      },
    }
  );

  return { update };
};
