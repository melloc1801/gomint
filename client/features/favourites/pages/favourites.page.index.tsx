import React from 'react';
import { useFavourites } from '../../phase/hooks/phase.favourites.hook';
import { formatDistanceToNowStrict } from 'date-fns';
import { AccessListCard } from '../../../components/AccessListCard';
import { useProfile } from '../../profile/hooks/profile.hook.me';
import { useWindowSize } from '../../../hooks/useWindowSize';

export const FavouritesPage: React.FC = () => {
  const favorites = useFavourites();
  const profile = useProfile();
  const size = useWindowSize();

  if (favorites.isSuccess) {
    return (
      <div className="my-10">
        <div className="grid grid-cols-12 gap-6">
          {favorites.data.map((favorite) => {
            return (
              <div
                key={favorite.project.name + favorite.name + favorite.outerId}
                className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
                <AccessListCard
                  type={favorite.type}
                  phaseId={favorite.outerId}
                  favorite={favorite.favorite}
                  windowWidth={size.width}
                  accessListName={favorite.name}
                  pfp={favorite.project?.pfpURL}
                  canLike={profile.isSuccess}
                  image={favorite.project?.headerURL}
                  slug={favorite.project?.slug || ''}
                  projectName={favorite.project?.name}
                  color={favorite.project?.headerColor}
                  favoriteCount={favorite.favoriteCount}
                  numberOfWinners={favorite.numberOfWinners}
                  endingIn={
                    favorite.registrationEnd
                      ? new Date(favorite.registrationEnd) < new Date()
                        ? 'Registration ended'
                        : `Ending in ${formatDistanceToNowStrict(
                            new Date(favorite.registrationEnd)
                          )}`
                      : 'No end date'
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  if (favorites.isError) {
    return <div>Error when fetching all registrations</div>;
  }

  return null;
};
