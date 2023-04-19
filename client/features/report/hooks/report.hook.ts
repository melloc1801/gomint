import { AxiosError } from 'axios';
import { Report } from '../utils/report.utils.types';
import { SUCCESS_MESSAGES } from '../../../lib/handleSuccess';
import fetcher from '../../../lib/fetcher';
import { handleErrors } from '../../../lib/handleErrors';
import { queryClient } from '../../../pages/_app';
import toast from 'react-hot-toast';
import { useMutation } from 'react-query';

export const useReport = (slug?: string) => {
  const create = useMutation<Partial<Report>, AxiosError, Partial<Report>>(
    (data) =>
      fetcher({
        method: 'POST',
        url: '/report',
        params: {
          slug,
        },
        data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('report');
        toast.success(SUCCESS_MESSAGES.REPORT_CREATE);
      },
      onError: (error) => {
        handleErrors(error);
      },
    }
  );

  return { create };
};
