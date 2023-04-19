import { discordURLPrefix, twitterURLPrefix } from '../utils/project.utils.constants';
import { identity, pickBy } from 'lodash';
import { useMutation, useQuery } from 'react-query';

import { AxiosError } from 'axios';
import { ProjectType } from '../utils/project.utils.types';
import { SUCCESS_MESSAGES } from '../../../lib/handleSuccess';
import fetcher from '../../../lib/fetcher';
import { handleErrors } from '../../../lib/handleErrors';
import { queryClient } from '../../../pages/_app';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

type Params = { isExternal: boolean };

export const useProject = (slug?: string, params?: Params, list?: string) => {
  const router = useRouter();

  const bySlug = useQuery<ProjectType, AxiosError>(
    ['projects', slug],
    () =>
      fetcher({
        method: 'GET',
        url: params?.isExternal ? '/project' : '/projects',
        params: {
          slug,
          list,
        },
      }),
    {
      retry: 0,
      refetchInterval: 0,
      enabled: Boolean(slug),
      onError: (error) => {
        handleErrors(error);
      },
    }
  );

  const del = useMutation(
    (slug: string) => fetcher({ method: 'DELETE', url: '/projects', params: { slug } }),
    {
      onError: handleErrors,
      onSuccess: () => {
        queryClient.invalidateQueries('projects');
        toast.success(SUCCESS_MESSAGES.PROJECT_DELETE);
      },
    }
  );

  const create = useMutation<Partial<ProjectType>, AxiosError, Partial<ProjectType>>(
    (data) =>
      fetcher({
        method: 'POST',
        url: '/projects',
        data: pickBy(
          {
            ...data,
            description: JSON.stringify(data.description),
            discordURL: data.discordURL ? `${discordURLPrefix}${data.discordURL}` : null,
            twitterURL: data.twitterURL
              ? `${twitterURLPrefix}${data.twitterURL.replace('@', '')}`
              : null,
          },
          identity
        ),
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('projects').then(() => router.push('/projects'));
        toast.success(SUCCESS_MESSAGES.PROJECT_CREATE);
      },
      onError: (error) => {
        handleErrors(error);
      },
    }
  );

  const update = useMutation<
    { slug: string; data: Partial<ProjectType> },
    AxiosError,
    { slug: string; data: Partial<ProjectType> }
  >(
    ({ slug, data }) =>
      fetcher({
        data: {
          ...data,
          description: JSON.stringify(data.description),
          discordURL: data.discordURL ? `${discordURLPrefix}${data.discordURL}` : null,
          twitterURL: data.twitterURL
            ? `${twitterURLPrefix}${data.twitterURL.replace('@', '')}`
            : null,
        },
        method: 'PATCH',
        url: 'projects',
        params: {
          slug,
        },
      }),
    {
      onSuccess: (initialData, data) => {
        queryClient.refetchQueries(['projects', data.slug || initialData.slug]);
        toast.success(SUCCESS_MESSAGES.PROJECT_UPDATE);

        router.push('/projects');
      },
      onError: (error) => {
        handleErrors(error);
      },
    }
  );

  return { delete: del, create, update, bySlug };
};
