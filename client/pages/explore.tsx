import 'react-multi-carousel/lib/styles.css';

import * as React from 'react';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { ClockIcon, FireIcon, QueueListIcon, SparklesIcon } from '@heroicons/react/24/outline';
import {
  useAllPhases,
  useEndingSoonPhases,
  useNewEventsPhases,
  useTrendingPhases,
} from '../features/phase/hooks/phase.all.hook';

import { AccessListCard } from '../components/AccessListCard';
import { Button } from '../components/Button';
import Carousel from 'react-multi-carousel';
import { Formik } from 'formik';
import Image from 'next/image';
import { InputField } from '../components/InputField';
import { MainHeader } from '../components/MainHeader';
import { PhaseType } from '../features/phase/utils/phase.utils.types';
import { Toggle } from '../components/Toggle';
import { Typography } from '../components/Typography';
import { formatDistanceToNowStrict } from 'date-fns';
import { useInView } from 'react-intersection-observer';
import { useProfile } from '../features/profile/hooks/profile.hook.me';
import { useWindowSize } from '../hooks/useWindowSize';

const responsive = {
  XsuperLargeDesktop: {
    breakpoint: { max: 5000, min: 1536 },
    items: 5,
  },

  superLargeDesktop: {
    breakpoint: { max: 1536, min: 1280 },
    items: 3,
  },
  desktop: {
    breakpoint: { max: 1280, min: 768 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 768, min: 0 },
    items: 1,
  },
};

const CustomRightArrow = ({ onClick }: { onClick?: React.MouseEventHandler }) => {
  return (
    <button
      onClick={onClick}
      className="absolute right-0 p-2.5 my-auto bg-white rounded-full shadow-md cursor-pointer hover:bg-gomint-blue hover:text-white transition-all ">
      <ArrowRightIcon className="w-4 h-4" />
    </button>
  );
};

const CustomLeftArrow = ({ onClick }: { onClick?: React.MouseEventHandler }) => {
  return (
    <button
      onClick={onClick}
      className="absolute left-0 p-2.5 my-auto bg-white rounded-full shadow-md cursor-pointer hover:bg-gomint-blue hover:text-white transition-all ">
      <ArrowLeftIcon className="w-4 h-4" />
    </button>
  );
};

export const renderCarousel = (
  cards: PhaseType[],
  params: {
    rtl?: boolean;
    width?: number;
    speed?: number;
    center?: boolean;
    arrows?: boolean;
    canLike?: boolean;
    infinite?: boolean;
    autoPlay?: boolean;
    swipeable?: boolean;
    dragglable?: boolean;
  }
) => {
  return (
    <Carousel
      arrows={params.arrows}
      responsive={responsive}
      centerMode={params.center}
      autoPlay={params.autoPlay}
      infinite={params.infinite}
      autoPlaySpeed={params.speed}
      customRightArrow={<CustomRightArrow />}
      customLeftArrow={<CustomLeftArrow />}>
      {cards.map((card) => (
        <div key={card.name} className="p-3">
          <AccessListCard
            type={card.type}
            phaseId={card.outerId}
            favorite={card.favorite}
            canLike={params.canLike}
            windowWidth={params.width}
            accessListName={card.name}
            pfp={card.project?.pfpURL}
            image={card.project?.headerURL}
            slug={card.project?.slug || ''}
            projectName={card.project?.name}
            color={card.project?.headerColor}
            favoriteCount={card.favoriteCount}
            numberOfWinners={card.numberOfWinners}
            endingIn={
              card.registrationEnd
                ? `Ending in ${formatDistanceToNowStrict(new Date(card.registrationEnd))}`
                : 'No end date'
            }
          />
        </div>
      ))}
    </Carousel>
  );
};

export default function Homepage() {
  const profile = useProfile();
  const size = useWindowSize();
  const { ref, inView } = useInView();
  const trending = useTrendingPhases({ limit: 10 });
  const newEvents = useNewEventsPhases({ limit: 10 });
  const endingSoon = useEndingSoonPhases({ limit: 10 });

  const [searchText, setSearchText] = React.useState<string | undefined>();
  const [includeEnded, setIncludeEnded] = React.useState<boolean>(false);
  const allPhases = useAllPhases({ limit: 10, searchText, includeEnded });

  React.useEffect(() => {
    if (inView) {
      allPhases.fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div className="relative overflow-x-hidden">
      <div className="absolute top-0 left-0 w-screen h-fit lg:h-3xl -z-10">
        <Image
          layout="fill"
          alt="background"
          className="w-screen"
          src="/assets/img/landing/hero/bg-X1.png"
        />
      </div>
      <MainHeader />

      <div className="px-8 pb-8 md:px-16">
        <div>
          <div className="flex">
            <FireIcon className="w-10 mr-3 text-orange-500" />
            <Typography variant="h1">Trending</Typography>
          </div>
          <Typography variant="label">Discover the most popular access lists</Typography>

          {trending.isSuccess
            ? renderCarousel(trending.data, { width: size.width, canLike: profile.isSuccess })
            : null}
        </div>

        <div className="my-20">
          <div className="flex">
            <ClockIcon className="w-10 mr-3 text-pink-500" />
            <Typography variant="h1">Ending soon</Typography>
          </div>
          <Typography variant="label">Register at project access lists before they end</Typography>

          {endingSoon.isSuccess ? (
            renderCarousel(endingSoon.data, { width: size.width, canLike: profile.isSuccess })
          ) : (
            <div />
          )}
        </div>

        <div className="my-20">
          <div className="flex">
            <SparklesIcon className="w-10 mr-3 text-yellow-400" />
            <Typography variant="h1">New events</Typography>
          </div>
          <Typography variant="label">Discover newly created project access lists</Typography>

          {newEvents.isSuccess
            ? renderCarousel(newEvents.data, { width: size.width, canLike: profile.isSuccess })
            : null}
        </div>

        <div className="my-20">
          <div className="flex">
            <QueueListIcon className="w-10 mr-3 text-emerald-500" />
            <Typography variant="h1">All Events</Typography>
          </div>
          <Typography variant="label">Discover all access lists with one glimpse</Typography>

          <Formik
            onSubmit={(values) => {
              setSearchText(values.search || undefined);
            }}
            initialValues={{ search: '' }}>
            {({ handleSubmit }) => (
              <form id="search" onSubmit={handleSubmit}>
                <div className="grid grid-flow-col grid-cols-4 gap-4">
                  <div className="col-span-3">
                    <InputField
                      name="search"
                      placeholder="Search for projects or access lists"
                      type="text"
                    />
                  </div>
                  <div className="justify-end col-span-1 align-top">
                    <Button
                      type="submit"
                      form="search"
                      variant="neutral"
                      className="w-full"
                      disabled={allPhases.isLoading}>
                      Search
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </Formik>
          <div className="flex mb-2">
            <div className="pr-4 text-sm">Include ended events</div>
            <Toggle
              variant="success"
              enabled={includeEnded}
              onClick={(value) => setIncludeEnded(value)}
            />
          </div>
          <div className="grid gap-3 py-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
            {allPhases.isSuccess && allPhases.data.pages[0].phases.length
              ? allPhases.data.pages
                  .flatMap((page) => page.phases)
                  .map((card) => (
                    <div className="p-1.5 overflow-hidden" key={card.name}>
                      <AccessListCard
                        type={card.type}
                        phaseId={card.outerId}
                        favorite={card.favorite}
                        windowWidth={size.width}
                        accessListName={card.name}
                        pfp={card.project?.pfpURL}
                        canLike={profile.isSuccess}
                        image={card.project?.headerURL}
                        slug={card.project?.slug || ''}
                        projectName={card.project?.name}
                        color={card.project?.headerColor}
                        favoriteCount={card.favoriteCount}
                        numberOfWinners={card.numberOfWinners}
                        endingIn={
                          card.registrationEnd
                            ? new Date(card.registrationEnd) < new Date()
                              ? 'Registration ended'
                              : `Ending in ${formatDistanceToNowStrict(
                                  new Date(card.registrationEnd)
                                )}`
                            : 'No end date'
                        }
                      />
                    </div>
                  ))
              : 'No access lists found'}
          </div>
          <div ref={ref} />
        </div>
      </div>
    </div>
  );
}
