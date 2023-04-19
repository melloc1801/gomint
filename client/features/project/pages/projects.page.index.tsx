import * as React from 'react';

import { useProjects, useProjectsControlled } from '../hooks/projects.hook';

import Link from 'next/link';
import { PagesTabs } from '../../../components/PagesTabs';
import { PlusIcon } from '@heroicons/react/24/outline';
import { ProjectCard } from '../../../components/ProjectCard';
import { RegistrationsPage } from '../../registrations/pages/registrations.page.index';
import { useProfile } from '../../profile/hooks/profile.hook.me';
import { FavouritesPage } from '../../favourites/pages/favourites.page.index';

export function ProjectsPage() {
  useProfile({ redirectTo: '/' });

  const projects = useProjects();
  const projectsControlled = useProjectsControlled();

  return (
    <div className="container px-8 mx-auto py-14">
      <PagesTabs tabs={['Projects', 'Registrations', 'Favorites']}>
        <div>
          {projects.isSuccess && projectsControlled.isSuccess ? (
            <div className="grid grid-cols-12 gap-6 my-10">
              {projects.data.concat(projectsControlled.data).map((project) => (
                <div
                  key={project.name}
                  className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
                  <ProjectCard
                    name={project.name}
                    slug={project.slug}
                    pfp={project.pfpURL}
                    image={project.headerURL}
                    color={project.headerColor}
                    canBeDeleted={!project.isController}
                  />
                </div>
              ))}
              <Link href="/projects/create">
                <div className="flex flex-col items-center justify-center col-span-12 transition-all ease-in-out border rounded cursor-pointer sm:col-span-6 md:col-span-4 lg:col-span-3 text-slate-400 group hover:text-blue-600 hover:border-blue-600 min-h-[300px] shadow hover:scale-[102.5%] shadow-slate-50">
                  <PlusIcon className="w-16 mb-4 group-hover:text-blue-600" />
                  <span className="group-hover:text-blue-600">Create new project</span>
                </div>
              </Link>
            </div>
          ) : null}
        </div>
        <RegistrationsPage />
        <FavouritesPage />
      </PagesTabs>
    </div>
  );
}
