import * as React from 'react';

import { HeartIcon as HeartIconOutline, TicketIcon } from '@heroicons/react/24/outline';

import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import cx from 'classnames';
import { isNumber } from 'lodash';
import set from 'lodash/set';
import toast from 'react-hot-toast';
import { usePhase } from '../features/phase/hooks/phase.hook';

type AccessListCard = {
  slug: string;
  pfp?: string;
  type?: string;
  color?: string;
  image?: string;
  phaseId: number;
  canLike?: boolean;
  endingIn?: string;
  favorite: boolean;
  windowWidth?: number;
  projectName?: string;
  accessListName: string;
  favoriteCount?: number;
  numberOfWinners?: number | string | null;
};

export const AccessListCard = (props: AccessListCard) => {
  const phase = usePhase(props.slug);
  const ref = React.useRef<HTMLDivElement>(null);

  const headerBackgroundStyles = {};

  if (props.color) {
    set(headerBackgroundStyles, 'backgroundColor', props.color);
  }

  React.useEffect(() => {
    if (ref.current) {
      const height = ref.current.offsetWidth / 3;
      ref.current.style.height = `${height < 100 ? 100 : height}px`;
    }
  }, [props.windowWidth]);

  return (
    <div className="relative p-3 transition ease-in-out bg-white border rounded shadow-sm hover:scale-[102.5%] border-slate-200 block text-blue-1000">
      <Link passHref href={`/${props.slug}?list=${props.accessListName}`}>
        <a className="cursor-pointer no-underline" target="_blank">
          <div ref={ref} className="relative flex justify-center">
            {props.image ? (
              <Image
                quality={100}
                layout="fill"
                src={props.image}
                alt={props.projectName}
                className="object-cover rounded"
              />
            ) : null}
            <div style={headerBackgroundStyles} className="w-full h-full rounded bg-slate-100" />

            <div className="absolute bg-white border-2 border-white rounded-full shadow-md w-14 h-14 lg:w-16 lg:h-16 2xl:w-20 2xl:h-20 left-4 -bottom-4 shrink-0">
              {props.pfp ? (
                <Image
                  layout="fill"
                  src={props.pfp}
                  alt={props.projectName}
                  className="object-cover rounded-full"
                />
              ) : (
                <div className="h-full rounded-full bg-slate-100" />
              )}
            </div>
          </div>

          <div className="flex items-start justify-between px-4 mt-7">
            <div className="pr-4 overflow-hidden">
              <div className="overflow-hidden text-lg font-semibold text-blue-1000 text-ellipsis whitespace-nowrap">
                {props.projectName}
              </div>
              <div className="mt-1 overflow-hidden text-sm font-semibold text-slate-400 text-ellipsis whitespace-nowrap">
                {props.accessListName}
              </div>
            </div>
            <div
              className={cx(
                'px-2 py-1 text-xs font-medium text-white rounded',
                props.type === 'LIMIT' ? 'bg-gomint-orange' : 'bg-gomint-blue'
              )}>
              {props.type === 'LIMIT' ? 'FCFS' : 'Raffle'}
            </div>
          </div>
        </a>
      </Link>
      <div className="flex justify-between pt-3 pl-4 mt-8 border-t border-opacity-75 border-slate-200">
        <div className="text-sm font-medium text-blue-1000">{props.endingIn}</div>

        <div className="flex text-sm font-medium">
          {isNumber(props.numberOfWinners) ? (
            <div className="flex items-center mr-3">
              <TicketIcon className="w-5 h-5 mr-1.5" /> {props.numberOfWinners}
            </div>
          ) : null}
          <div
            className="flex items-center text-red-500 group cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              if (props.canLike) {
                props.favorite
                  ? phase.dislike.mutateAsync({ id: props.phaseId })
                  : phase.like.mutateAsync({ id: props.phaseId });
              } else {
                toast.error('Sign in to add the access list to favorites', {
                  id: 'favorites',
                });
              }
            }}>
            {props.favorite ? (
              <HeartIconSolid className="w-5 h-5 mr-1 transition-all ease-in-out group-active:scale-105 group-hover:scale-125" />
            ) : (
              <HeartIconOutline className="w-5 h-5 mr-1 transition-all ease-in-out group-active:scale-105 group-hover:scale-125" />
            )}
            <span className="min-w-[20px]">{props.favoriteCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
