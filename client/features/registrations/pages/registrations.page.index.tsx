import * as React from 'react';

import { RegistrationCard } from '../../../components/RegistrationCard';
import { StarIcon } from '@heroicons/react/24/solid';
import { Tabs } from '../../../components/Tabs';
import { useProfile } from '../../profile/hooks/profile.hook.me';
import { useRegistration } from '../../phase/hooks/phase.registration.hook';
import { useRegistrations } from '../../phase/hooks/phase.registrations.hook';

export function RegistrationsPage() {
  useProfile({ redirectTo: '/' });

  const registration = useRegistration();
  const registrations = useRegistrations();

  if (registrations.isSuccess) {
    const wins = registrations.data.filter((registration) => registration.winner);
    const loses = registrations.data.filter((registration) => !registration.winner);

    return (
      <div className="my-8">
        <Tabs
          tabs={[
            { title: 'Spots you won', icon: (props) => <StarIcon {...props} /> },
            { title: 'Other registrations' },
          ]}>
          <div className="grid grid-cols-12 gap-6 my-8">
            {wins.map((win) => (
              <div
                key={win.project.name + win.name + win.outerId}
                className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
                <RegistrationCard
                  name={win.project.name}
                  pfp={win.project.pfpURL}
                  image={win.project.headerURL}
                  color={win.project.headerColor}
                  slug={`${win.project.slug}?list=${win.name}`}
                  onCancel={() =>
                    registration.cancel.mutateAsync({ id: win.outerId, slug: win.project.slug })
                  }
                />
              </div>
            ))}
            {!wins.length ? <div className="col-span-12">No registrations found</div> : null}
          </div>
          <div className="grid grid-cols-12 gap-6 my-8">
            {loses.map((loss) => (
              <div
                key={loss.project.name + loss.name + loss.outerId}
                className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
                <RegistrationCard
                  name={loss.project.name}
                  pfp={loss.project.pfpURL}
                  image={loss.project.headerURL}
                  color={loss.project.headerColor}
                  slug={`${loss.project.slug}?list=${loss.name}`}
                  onCancel={() =>
                    registration.cancel.mutateAsync({ id: loss.outerId, slug: loss.project.slug })
                  }
                />
              </div>
            ))}
            {!loses.length ? <div className="col-span-12">No registrations found</div> : null}
          </div>
        </Tabs>
      </div>
    );
  }

  if (registrations.isError) {
    return <div>Error when fetching all registrations</div>;
  }

  return null;
}
