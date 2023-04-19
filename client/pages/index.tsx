import { AccessListCard } from '../components/AccessListCard';
import { ButtonTryForFree } from '../components/ButtonTryForFree';
import { Faq } from '../components/Faq';
import { Features } from '../components/Features';
import Image from 'next/image';
import { MainHeader } from '../components/MainHeader';
import { Pricing } from '../components/Pricing';
import { formatDistanceToNowStrict } from 'date-fns';
import { useProfile } from '../features/profile/hooks/profile.hook.me';
import { useTrendingPhases } from '../features/phase/hooks/phase.all.hook';
import { useWindowSize } from '../hooks/useWindowSize';

export default function Homepage() {
  const profile = useProfile();

  const size = useWindowSize();
  const trending = useTrendingPhases({ limit: 6 });

  return (
    <div className="max-w-full overflow-x-hidden">
      <div className="relative w-screen pb-6 overflow-x-hidden lg:py-0 lg:min-h-screen">
        <div className="fixed top-0 left-0 w-full h-full min-h-full overflow-hidden -z-10">
          <Image
            layout="fill"
            alt="background"
            src="/assets/img/landing/hero/bg-X1.png"
            className="absolute top-0 left-0 block object-cover w-full h-full"
          />
        </div>

        <div className="absolute z-10 w-full">
          <MainHeader />
        </div>

        <div className="container relative flex items-center justify-center h-screen px-4 mx-auto text-blue-1000">
          <div className="max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl lg:text-7xl !leading-tight font-medium mb-4">
              The smartest way&nbsp;to <div className="font-bold">start your NFT project</div>
            </h1>
            <p className="mb-8 text-sm lg:mb-12 lg:text-lg !leading-relaxed">
              Build quality NFT projects with proper access lists, smart contracts and minting
              websites. Forget about hiring a developer; instead, focus on what is important to you.
            </p>
            <ButtonTryForFree />
          </div>
        </div>

        <div className="mx-auto transition-all max-w-7xl">
          <h3 className="text-3xl lg:text-5xl !leading-normal font-bold mb-8 text-center">
            Trending now
          </h3>

          <div className="grid gap-6 py-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
            {trending.isSuccess
              ? trending.data.map((card) => (
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
        </div>

        <div className="h-full py-10">
          <div className="container mx-auto">
            <h3 className="text-3xl lg:text-5xl !leading-tight font-medium mb-4 text-center mt-16">
              Only one purpose.
              <br /> <strong>Satisfaction!</strong>
            </h3>
            <Pricing getStartedButton={<ButtonTryForFree variant="secondary" />} />
          </div>
        </div>

        <div className="container max-w-6xl px-5 pb-20 mx-auto">
          <h3 className="text-3xl lg:text-5xl !leading-tight mb-8 text-center">
            <span>Stress less.</span>
            <br />
            <span className="font-bold">Create more!</span>
          </h3>
          <p className="max-w-4xl mx-auto mt-0 text-lg text-center mb-14">
            Running quality projects efficiently, from community building to developing your IT
            infrastructure without even being a developer,{' '}
            <span className="font-bold">
              was never more accessible thanks to our one-stop-shop toolkit.
            </span>
          </p>
          <Features windowWidth={size.width} />
        </div>

        <div className="container max-w-6xl px-5 pb-20 mx-auto">
          <h3 className="text-3xl lg:text-5xl !leading-normal mb-14 text-center font-bold">
            Frequently asked questions
          </h3>
          <Faq />
        </div>
      </div>
    </div>
  );
}
