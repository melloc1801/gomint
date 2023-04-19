import fetcher from '../../../lib/fetcher';
import { queryClient } from '../../../pages/_app';
import { useMutation } from 'react-query';
import { handleErrors } from '../../../lib/handleErrors';
import { AxiosError } from 'axios';

export const useWallet = () => {
  const add = useMutation<
    string,
    AxiosError,
    { address: string; signature: string; label: string }
  >(
    (data) =>
      fetcher<string>({
        method: 'POST',
        url: '/user/wallet',
        data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('profile');
      },
      onError: (error) => {
        handleErrors(error);
      },
    }
  );

  const remove = useMutation<string, AxiosError, { address: string }>(
    (data) =>
      fetcher({
        method: 'DELETE',
        url: '/user/wallet',
        data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('profile');
      },
      onError: (error) => {
        handleErrors(error);
      },
    }
  );

  return { add, remove };
};
