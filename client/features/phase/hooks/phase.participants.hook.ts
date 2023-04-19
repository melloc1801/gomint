import { Column, Order, ParticipantPaginationType } from '../utils/phase.utils.types';
import { useMutation, useQuery } from 'react-query';

import { SUCCESS_MESSAGES } from '../../../lib/handleSuccess';
import fetcher from '../../../lib/fetcher';
import { isNumber } from 'lodash';
import { queryClient } from '../../../pages/_app';
import toast from 'react-hot-toast';

type AddResponseType = {
  addresses: string[];
};

export const useParticipant = (slug?: string, phaseId?: number) => {
  const add = useMutation(
    (addresses: string[]) =>
      fetcher<AddResponseType>({
        method: 'POST',
        url: '/participants/manually',
        params: {
          slug,
          id: phaseId,
        },
        data: {
          addresses,
        },
      }),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['participants']);
        if (!data.addresses.length) {
          toast.success(SUCCESS_MESSAGES.PARTICIPANTS_ADDED);
          return;
        } else {
          toast(SUCCESS_MESSAGES.PARTICIPANTS_ADDED_PARTIALLY, {
            icon: '⚠️',
            duration: 5000,
          });
          return;
        }
      },
    }
  );

  const del = useMutation(
    ({ address }: { address: string; page: number }) =>
      fetcher({
        method: 'DELETE',
        url: '/participants/manually',
        params: {
          slug,
          address,
          id: phaseId,
        },
      }),
    {
      onSuccess: (_, { page }) => {
        // queryClient.invalidateQueries(['projects', slug]);
        queryClient.invalidateQueries(['participants', page]);
      },
    }
  );

  const update = useMutation(
    ({ address, winner }: { address: string; winner: boolean; page: number }) =>
      fetcher<{ address: string; winner: boolean }>({
        method: 'PATCH',
        url: '/participants',
        params: {
          slug,
          address,
          id: phaseId,
        },
        data: {
          winner,
        },
      }),
    {
      onSuccess: (_, { page }) => {
        queryClient.invalidateQueries(['projects', slug]);
        queryClient.invalidateQueries(['participants', page]);
      },
    }
  );

  return { add, del, update };
};

export const useParticipants = ({
  id,
  slug,
  page = 0,
  order = 'asc',
  column = 'createdAt',
}: {
  id?: number;
  page: number;
  slug?: string;
  order: Order;
  column: Column;
}) =>
  useQuery<ParticipantPaginationType>(
    ['participants', page, order, column, id],
    () =>
      fetcher({
        method: 'GET',
        url: '/participants',
        params: {
          id,
          slug,
          page,
          order,
          sortingColumn: column,
        },
      }),
    {
      keepPreviousData: true,
      enabled: Boolean(slug) && isNumber(id) && id >= 0,
    }
  );
