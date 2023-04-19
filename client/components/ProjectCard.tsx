import * as React from 'react';

import { ArrowTopRightOnSquareIcon, Cog8ToothIcon, TrashIcon } from '@heroicons/react/24/outline';

import Image from 'next/image';
import Link from 'next/link';
import { Menu } from './Menu';
import { MenuItemButton } from '../components/MenuItemButton';
import set from 'lodash/set';
import { useProject } from '../features/project/hooks/project.hook';
import { useRouter } from 'next/router';

type ProjectCard = {
  name: string;
  slug: string;
  pfp?: string;
  color?: string;
  image?: string;
  canBeDeleted: boolean;
};

export const ProjectCard = (props: ProjectCard) => {
  const router = useRouter();
  const project = useProject();

  const headerBackgroundStyles = {};

  if (props.color) {
    set(headerBackgroundStyles, 'backgroundColor', props.color);
  }

  return (
    <div
      className="h-full p-3 transition ease-in-out border rounded cursor-pointer hover:scale-[102.5%] shadow shadow-slate-50 border-slate-200"
      onClick={() => router.push(`/projects/${props.slug}/dashboard`)}>
      <div className="relative flex justify-center h-56">
        {props.image ? (
          <Image
            quality={100}
            layout="fill"
            alt={props.name}
            src={props.image}
            className="object-cover rounded"
          />
        ) : null}
        <div style={headerBackgroundStyles} className="w-full h-full rounded bg-slate-100" />
      </div>
      <div className="relative py-4 pb-0">
        <div className="absolute z-10 right-2 -top-4">
          <Menu>
            <MenuItemButton
              icon={TrashIcon}
              className="text-red-500"
              iconClassName="!text-red-500"
              onClick={() => {
                if (
                  window?.confirm(
                    'By deleting the project, you permanently lose all associated data. Do you want to continue?'
                  )
                ) {
                  project.delete.mutate(props.slug);
                }
              }}>
              Delete
            </MenuItemButton>
          </Menu>
        </div>
        <div className="flex items-start">
          <div className="relative w-10 h-10 mr-3 shrink-0">
            {props.pfp ? (
              <Image
                layout="fill"
                src={props.pfp}
                alt={props.name}
                className="object-cover rounded-full"
              />
            ) : (
              <div className="h-full rounded-full bg-slate-100" />
            )}
          </div>
          <div className="self-center text-lg font-semibold text-blue-1000">{props.name}</div>
        </div>
        <div className="flex items-center justify-end">
          <Link passHref href={`/projects/${props.slug}/update`}>
            <a onClick={(e) => e.stopPropagation()} target="_blank" className="mr-3">
              <Cog8ToothIcon className="w-6 h-6 mt-0.5 cursor-pointer text-slate-300 hover:text-gomint-blue" />
            </a>
          </Link>

          <Link passHref href={`/${props.slug}`}>
            <a onClick={(e) => e.stopPropagation()} target="_blank">
              <ArrowTopRightOnSquareIcon className="w-6 h-6 cursor-pointer text-slate-300 hover:text-gomint-blue" />
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};
