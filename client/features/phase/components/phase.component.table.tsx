import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentDuplicateIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { Column, Order, ParticipantType } from '../utils/phase.utils.types';

import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import cx from 'classnames';
import { formatAddress } from '../utils/phase.utils.helpers';
import { useProfile } from '../../profile/hooks/profile.hook.me';
import toast from 'react-hot-toast';

const columns: Array<{
  name: Column;
  label: string;
  className: string;
}> = [
  {
    name: 'address',
    label: 'Wallet',
    className: 'col-span-2',
  },
  {
    label: 'Discord',
    name: 'discordUserName',
    className: 'col-span-3 lg:col-span-2',
  },
  {
    label: 'Twitter',
    name: 'twitterUserName',
    className: 'col-span-3 lg:col-span-2',
  },
  {
    name: 'createdAt',
    label: 'Registration',
    className: 'col-span-2',
  },
  {
    name: 'winner',
    label: 'Winner',
    className: 'col-span-1 lg:col-span-2 justify-center text-center',
  },
];

export type OnDeleteRowClick = (address: string) => void;
export type OnWinnerClick = (value: { address: string; value: boolean }) => void;
export type OnChangeSort = (value: { order: Order; column: Column }) => void;

type ParticipantTableProps = {
  order?: Order;
  currentPage?: number;
  hasNextPage: boolean;
  sortingColumn?: Column;
  onChangeSort?: OnChangeSort;
  onPrevPageClick?: () => void;
  onNextPageClick?: () => void;
  onWinnerClick?: OnWinnerClick;
  participants?: ParticipantType[];
  onDeleteRowClick?: OnDeleteRowClick;
};
export const ParticipantTable: React.FC<ParticipantTableProps> = ({
  currentPage,
  onChangeSort,
  order = 'asc',
  onWinnerClick,
  onPrevPageClick,
  onNextPageClick,
  onDeleteRowClick,
  participants = [],
  hasNextPage = false,
  sortingColumn = 'createdAt',
}) => {
  useProfile();
  const isNextPageButtonDisabled = !hasNextPage;
  const isPrevPageButtonDisabled = currentPage === 0;

  return (
    <div>
      <div className="max-w-full mb-8 overflow-auto text-sm border rounded border-slate-200">
        <div className="overflow-auto min-w-lg 2xl:min-w-full">
          <div className="grid items-center grid-cols-12 px-4 py-3 bg-slate-100">
            {columns.map((column) => (
              <div
                className={cx(
                  column.className,
                  'flex items-center cursor-pointer font-semibold text-gray-500 leading-6'
                )}
                key={column.name}
                onClick={() => {
                  onChangeSort
                    ? onChangeSort({
                        column: column.name,
                        order:
                          column.name === sortingColumn
                            ? order === 'asc'
                              ? 'desc'
                              : 'asc'
                            : order,
                      })
                    : null;
                }}>
                {column.label}
                {column.name === sortingColumn ? (
                  <div
                    className={cx(
                      {
                        'rotate-180': order === 'asc',
                      },
                      'w-4 h-4 ml-2 text-gray-500'
                    )}>
                    <ChevronDownIcon />
                  </div>
                ) : null}
              </div>
            ))}
            <div className="col-span-1 lg:col-span-2"></div>
          </div>
          <div>
            {participants?.map((participant) => (
              <div
                key={participant.registrationAddress}
                className="grid items-center grid-cols-12 px-4 py-3 overflow-auto leading-6 border-t border-slate-200">
                <div className="col-span-2 group">
                  <div
                    className="flex items-center group-hover:cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(participant.registrationAddress);
                      toast('Address copied to clipboard', { id: participant.registrationAddress });
                    }}>
                    <span>{formatAddress(participant.registrationAddress)}</span>
                    <DocumentDuplicateIcon className="hidden w-4 h-4 ml-1 text-slate-300 group-hover:inline" />
                  </div>
                </div>
                <div className="col-span-3 lg:col-span-2">
                  {participant.discordUserName ? participant.discordUserName : '—'}
                </div>
                <div className="col-span-3 lg:col-span-2">
                  {participant.twitterUserName ? participant.twitterUserName : '—'}
                </div>
                <div className="col-span-2">{new Date(participant.createdAt).toLocaleString()}</div>
                <div className="flex justify-center col-span-1 lg:col-span-2">
                  <button
                    onClick={() =>
                      onWinnerClick
                        ? onWinnerClick({
                            address: participant.address,
                            value: !participant.winner,
                          })
                        : null
                    }>
                    <StarIcon
                      className={cx(
                        {
                          'text-gomint-grey opacity-50 hover:opacity-100': !participant.winner,
                          'text-gomint-orange': participant.winner,
                        },
                        'w-6 h-6'
                      )}
                    />
                  </button>
                </div>
                <div className="col-span-1 lg:col-span-2 justify-self-center">
                  <button
                    className="flex items-center justify-center w-5 h-5 bg-red-100 rounded-full"
                    onClick={() =>
                      onDeleteRowClick ? onDeleteRowClick(participant.address) : null
                    }>
                    <PlusIcon className="w-3 h-3 rotate-45 opacity-50 text-gomint-red hover:opacity-100" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <button
          className={cx(
            { 'opacity-20': isPrevPageButtonDisabled },
            'flex items-center mr-5 text-sm group'
          )}
          onClick={() => (onPrevPageClick ? onPrevPageClick() : null)}
          disabled={isPrevPageButtonDisabled}>
          Previous page
          <div
            className={cx(
              {
                'text-gomint-blue group-hover:bg-gomint-blue group-hover:text-white':
                  !isPrevPageButtonDisabled,
              },
              'flex items-center justify-center w-5 h-5 rounded-full ml-2.5 shadow-md bg-white'
            )}>
            <ChevronLeftIcon className="w-3 h-3" />
          </div>
        </button>
        <button
          className={cx(
            { 'opacity-20': isNextPageButtonDisabled },
            'flex items-center text-sm group'
          )}
          onClick={() => (onNextPageClick ? onNextPageClick() : null)}
          disabled={isNextPageButtonDisabled}>
          <div
            className={cx(
              {
                'text-gomint-blue group-hover:bg-gomint-blue group-hover:text-white':
                  !isNextPageButtonDisabled,
              },
              'flex items-center justify-center w-5 h-5 rounded-full mr-2.5 text-gomint-blue shadow-md bg-white'
            )}>
            <ChevronRightIcon className="w-3 h-3" />
          </div>
          Next page
        </button>
      </div>
    </div>
  );
};
