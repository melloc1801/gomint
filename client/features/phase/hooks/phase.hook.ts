import { identity, pickBy } from 'lodash';

import { AxiosError } from 'axios';
import { PhaseType } from '../utils/phase.utils.types';
import { SUCCESS_MESSAGES } from '../../../lib/handleSuccess';
import { discordURLPrefix } from '../../project/utils/project.utils.constants';
import fetcher from '../../../lib/fetcher';
import { formatTimestamp } from '../../../lib/formatTimestamp';
import { handleErrors } from '../../../lib/handleErrors';
import { queryClient } from '../../../pages/_app';
import toast from 'react-hot-toast';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';

export const usePhase = (slug: string) => {
  const router = useRouter();

  const del = useMutation<void, AxiosError, { id: number }>(
    ({ id }) =>
      fetcher({
        method: 'DELETE',
        url: 'phases',
        params: {
          id,
          slug,
        },
      }),
    {
      onSuccess: (_) => {
        toast.success(SUCCESS_MESSAGES.PHASE_DELETE);
        queryClient.invalidateQueries(['projects', slug]);
      },
      onError: (error) => {
        handleErrors(error);
      },
    }
  );

  const duplicate = useMutation<void, AxiosError, { id: number }>(
    ({ id }) =>
      fetcher({
        method: 'POST',
        url: 'phases/duplicate',
        params: {
          id,
          slug,
        },
      }),
    {
      onSuccess: (_) => {
        toast.success(SUCCESS_MESSAGES.PHASE_DUPLICATE);
        queryClient.invalidateQueries(['projects', slug]);
      },
      onError: (error) => {
        handleErrors(error);
      },
    }
  );

  const like = useMutation<void, AxiosError, { id: number }>(
    ({ id }) =>
      fetcher({
        method: 'POST',
        url: 'phases/collector/favorite',
        params: {
          id,
          slug,
        },
      }),
    {
      onSuccess: (_) => {
        queryClient.invalidateQueries(['phases']);
      },
      onError: (error) => {
        handleErrors(error);
      },
    }
  );

  const dislike = useMutation<void, AxiosError, { id: number }>(
    ({ id }) =>
      fetcher({
        method: 'DELETE',
        url: 'phases/collector/favorite',
        params: {
          id,
          slug,
        },
      }),
    {
      onSuccess: (_) => {
        queryClient.invalidateQueries(['phases']);
      },
      onError: (error) => {
        handleErrors(error);
      },
    }
  );

  const create = useMutation<Partial<PhaseType>, AxiosError, Partial<PhaseType>>(
    (data) =>
      fetcher({
        data: {
          ...pickBy(
            {
              ...data,
              registrationEnd: data.registrationEnd ? formatTimestamp(data.registrationEnd) : null,
              registrationStart: data.registrationStart
                ? formatTimestamp(data.registrationStart)
                : null,
              discordServers: data.discordServers
                ? data.discordServers.map((server) => ({
                    ...server,
                    discordServerLink: server.discordServerLink
                      ? `${discordURLPrefix}${server.discordServerLink}`
                      : null,
                  }))
                : null,
            },
            identity
          ),
        },

        method: 'POST',
        url: '/phases',
        params: {
          slug,
        },
      }),
    {
      onSuccess: () => {
        toast.success(SUCCESS_MESSAGES.PHASE_CREATE);
        queryClient
          .invalidateQueries(['projects', slug])
          .then(() => router.push(`/projects/${router.query.slug}/dashboard`));
      },
      onError: (error) => {
        handleErrors(error);
      },
    }
  );

  const update = useMutation<Partial<PhaseType>, AxiosError, Partial<PhaseType>>(
    (data) =>
      fetcher({
        data: {
          ...data,
          discordServers: data.discordServers
            ? data.discordServers.map((server) => ({
                ...server,
                discordServerLink: server.discordServerLink
                  ? `${discordURLPrefix}${server.discordServerLink}`
                  : null,
              }))
            : null,
          minEth: data.minEth || null,
          mintPrice: data.mintPrice || null,
          registrationEnd: data.registrationEnd ? formatTimestamp(data.registrationEnd) : null,
          registrationStart: data.registrationStart
            ? formatTimestamp(data.registrationStart)
            : null,
        },
        method: 'PATCH',
        url: '/phases',
        params: {
          slug,
          id: data.outerId,
        },
      }),
    {
      onSuccess: () => {
        toast.success(SUCCESS_MESSAGES.PHASE_UPDATE);

        queryClient
          .invalidateQueries(['projects', slug])
          .then(() => router.push(`/projects/${router.query.slug}/dashboard`));
      },
      onError: (error) => {
        handleErrors(error);
      },
    }
  );

  return { del, create, update, duplicate, like, dislike };
};
