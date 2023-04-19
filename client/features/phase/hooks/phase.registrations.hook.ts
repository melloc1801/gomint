import { PhaseType } from '../utils/phase.utils.types';
import { ProjectType } from '../../project/utils/project.utils.types';
import fetcher from '../../../lib/fetcher';
import { useQuery } from 'react-query';

export const useRegistrations = () =>
  useQuery('registrations', () =>
    fetcher<(PhaseType & { winner: boolean; project: ProjectType })[]>({
      method: 'GET',
      url: '/phases/registrations',
    })
  );
