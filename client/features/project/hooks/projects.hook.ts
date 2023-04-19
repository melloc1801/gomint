import { ProjectType } from '../utils/project.utils.types';
import fetcher from '../../../lib/fetcher';
import { handleErrors } from '../../../lib/handleErrors';
import { useQuery } from 'react-query';

// TODO:
// - Combine these 2 request

export const useProjects = () =>
  useQuery('projects', () =>
    fetcher<ProjectType[]>({
      method: 'GET',
      url: '/projects/all',
    })
  );

export const useProjectsControlled = () =>
  useQuery(
    ['projects', 'controlled'],
    () =>
      fetcher<ProjectType[]>({
        method: 'GET',
        url: '/projects/all/controlled',
      }),
    {
      onError: handleErrors,
    }
  );
