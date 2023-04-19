import Link from 'next/link';
import cx from 'classnames';
import { useProfile } from '../features/profile/hooks/profile.hook.me';
import { useRouter } from 'next/router';

export const Nav = () => {
  const router = useRouter();
  const profile = useProfile();

  const isMainPage = router.asPath === '/';
  const isExplorePage = router.asPath === '/explore';
  const isDashboardPage =
    router.asPath === '/projects' ||
    router.asPath === '/favourite' ||
    router.asPath === '/registrations';

  const linkClassNames = (isActive?: boolean) =>
    cx(
      'text-blue-1000 ml-8 first:ml-0 no-underline hover:underline',
      isActive ? 'font-semibold' : 'font-medium'
    );
  return (
    <nav className="max-w-full hide-scrollbar overflow-auto">
      <Link href="/">
        <a className={linkClassNames(isMainPage)}>Home</a>
      </Link>

      <Link href="/explore">
        <a className={linkClassNames(isExplorePage)}>Explore</a>
      </Link>

      <a
        target="_blank"
        rel="noreferrer"
        href="https://docs.gomint.art"
        className={linkClassNames()}>
        Docs
      </a>

      {profile.isSuccess ? (
        <Link href="/projects">
          <a className={linkClassNames(isDashboardPage)}>Dashboard</a>
        </Link>
      ) : null}
    </nav>
  );
};
