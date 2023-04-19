import { ButtonConnect } from './ButtonConnect';
import { ButtonSignIn } from './ButtonSignIn';
import { Logo } from './Logo';
import { Nav } from './Nav';
import { useProfile } from '../features/profile/hooks/profile.hook.me';
import { useRouter } from 'next/router';

export const MainHeader = () => {
  const router = useRouter();
  const profile = useProfile();

  const isMainPage = router.asPath === '/';
  const isExplorePage = router.asPath === '/explore';

  return (
    <div className="w-full px-8 md:px-16">
      <div className="flex flex-col items-center justify-between py-12 md:flex-row">
        <div className="flex flex-col items-center md:flex-row">
          <Logo />
          <div className="mx-0 mt-6 mb-8 md:mx-16 md:my-0">
            <Nav />
          </div>
        </div>
        <div className="flex">
          {isMainPage && !profile.isSuccess ? null : <ButtonConnect>Get started</ButtonConnect>}
          {profile.isSuccess ? null : (
            <ButtonSignIn hidden={isExplorePage} className="ml-3">
              Sign in
            </ButtonSignIn>
          )}
        </div>
      </div>
    </div>
  );
};
