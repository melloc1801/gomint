import { useMutation, useQuery } from 'react-query';

import { SUCCESS_MESSAGES } from '../../../lib/handleSuccess';
import fetcher from '../../../lib/fetcher';
import { handleErrors } from '../../../lib/handleErrors';
import { queryClient } from '../../../pages/_app';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

export const useRegistration = (
  slug?: string,
  phaseId?: number,
  params?: { checkStatusEnabled?: boolean }
) => {
  const start = useMutation<boolean, AxiosError, number | undefined>(
    (id) => fetcher({ method: 'PATCH', url: '/phases/start', params: { id, slug } }),
    {
      onSuccess: () => {
        toast.success(SUCCESS_MESSAGES.REGISTRATION_COMPLETE);
        queryClient.invalidateQueries(['projects', slug]);
      },
      onError: (error) => {
        handleErrors(error);
      },
    }
  );

  const stop = useMutation<boolean, AxiosError, number | undefined>(
    (id) => fetcher({ method: 'PATCH', url: '/phases/stop', params: { id, slug } }),
    {
      onSuccess: () => {
        toast.success(SUCCESS_MESSAGES.REGISTRATION_FINISHED);
        queryClient.invalidateQueries(['projects', slug]);
      },
      onError: (error) => {
        handleErrors(error);
      },
    }
  );

  const draw = useMutation<void, AxiosError, number | undefined>(
    (id) =>
      fetcher({
        method: 'PATCH',
        url: '/phases/winners',
        params: {
          id,
          slug,
        },
      }),
    {
      onSuccess: () => {
        toast.success(SUCCESS_MESSAGES.DRAW_COMPLETED);
        queryClient.invalidateQueries(['participants']);
        queryClient.invalidateQueries(['projects', slug]);
      },
      onError: (error) => {
        handleErrors(error);
      },
    }
  );

  const downloadWinners = useMutation<BlobPart, AxiosError, { id?: number; name?: string }>(
    ({ id }) =>
      fetcher<BlobPart>({
        method: 'GET',
        url: '/phases/winners/file',
        params: {
          id,
          slug,
        },
      }),
    {
      onSuccess: (data: BlobPart, params) => {
        const csv = URL.createObjectURL(new Blob([data]));
        const a = document.createElement('a');
        a.href = csv;
        a.setAttribute(
          'download',
          `${params.name
            ?.toLocaleLowerCase()
            .replace(' ', '-')}-winners-${new Date().toISOString()}.csv`
        );
        a.click();
      },
      onError: (error) => {
        handleErrors(error);
      },
    }
  );

  const downloadParticipants = useMutation<BlobPart, AxiosError, { id?: number; name?: string }>(
    ({ id }) =>
      fetcher<BlobPart>({
        method: 'GET',
        url: '/phases/participants/file',
        params: {
          id,
          slug,
        },
      }),
    {
      onSuccess: (data: BlobPart, params) => {
        const csv = URL.createObjectURL(new Blob([data]));
        const a = document.createElement('a');
        a.href = csv;
        a.setAttribute(
          'download',
          `${params.name
            ?.toLocaleLowerCase()
            .replace(' ', '-')}-participants-${new Date().toISOString()}.csv`
        );
        a.click();
      },
      onError: (error) => {
        handleErrors(error);
      },
    }
  );

  const register = useMutation<
    void,
    AxiosError,
    {
      id: number;
      slug: string;
      registrationAddress: string;
    }
  >(
    ({ id, slug, registrationAddress }) =>
      fetcher({
        method: 'POST',
        url: '/participants',
        params: { id, slug: slug },
        data: { registrationAddress },
      }),
    {
      onSuccess() {
        toast.success(SUCCESS_MESSAGES.USER_PHASE_REGISTER);
        queryClient.invalidateQueries('registration status');
      },
      onError: (error) => {
        queryClient.invalidateQueries(['profile']);
        handleErrors(error);
      },
    }
  );

  const status = useQuery<boolean, AxiosError>(
    ['registration status', phaseId, slug],
    () =>
      fetcher<boolean>({
        method: 'GET',
        url: '/participants/status',
        params: { id: phaseId, slug },
      }),
    {
      retry: 0,
      refetchInterval: 0,
      enabled: Boolean(slug) && (Boolean(phaseId) || phaseId === 0) && params?.checkStatusEnabled,
      onError: (error) => {
        handleErrors(error);
      },
    }
  );

  const cancel = useMutation<void, AxiosError, { id: number; slug: string }>(
    ({ id, slug }) =>
      fetcher({
        method: 'DELETE',
        url: '/participants',
        params: { id, slug: slug },
      }),
    {
      onSuccess() {
        toast.success(SUCCESS_MESSAGES.USER_PHASE_UNREGISTER);
        queryClient.invalidateQueries('registration status');
      },
      onError: (error) => {
        handleErrors(error);
      },
    }
  );

  return { start, stop, draw, downloadWinners, downloadParticipants, cancel, register, status };
};
