import { useInfiniteQuery, useQuery } from 'react-query';

import { PhaseType } from '../utils/phase.utils.types';
import fetcher from '../../../lib/fetcher';

export const useTrendingPhases = ({ limit = 6, page = 1 }: { limit?: number; page?: number }) =>
  useQuery(['phases', 'trending'], () =>
    fetcher<{ phases: PhaseType[] }>({
      method: 'GET',
      params: {
        page,
        limit,
      },
      url: '/phases/all/public?sort=participants&order=desc',
    }).then((result) => result.phases)
  );

export const useEndingSoonPhases = ({ limit = 6 }: { limit?: number }) =>
  useQuery(['phases', 'ending soon'], () =>
    fetcher<{ phases: PhaseType[] }>({
      method: 'GET',
      url: `/phases/all/public?sort=registrationEnd&order=asc&page=1&limit=${limit}`,
    }).then((result) => result.phases)
  );

export const useNewEventsPhases = ({ limit = 6 }: { limit?: number }) =>
  useQuery(['phases', 'new events'], () =>
    fetcher<{ phases: PhaseType[] }>({
      method: 'GET',
      url: `/phases/all/public?sort=createdAt&order=asc&page=1&limit=${limit}`,
    }).then((result) => result.phases)
  );

export const useAllPhases = ({
  searchText,
  limit = 12,
  includeEnded = false,
}: {
  limit?: number;
  searchText?: string;
  includeEnded?: boolean;
}) =>
  useInfiniteQuery(
    ['phases', 'all', searchText, includeEnded],
    ({ pageParam = 1 }) =>
      fetcher<{ phases: PhaseType[]; nextCursor: number | null }>({
        method: 'GET',
        url: `/phases/all/public`,
        params: {
          limit,
          searchText,
          includeEnded,
          page: pageParam,
        },
      }),
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    }
  );
