import { useQuery } from 'react-query';
import fetcher from '../../../lib/fetcher';
import { PhaseType } from '../utils/phase.utils.types';
import { ProjectType } from '../../project/utils/project.utils.types';

export const useFavourites = () =>
  useQuery(['phases'], () =>
    fetcher<(PhaseType & { winner: boolean; project: ProjectType })[]>({
      method: 'GET',
      url: '/phases/favorite',
    })
  );
