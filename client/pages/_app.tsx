import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/800.css';
import '@fontsource/montserrat/900.css';
import '@rainbow-me/rainbowkit/styles.css';
import '../styles/globals.css';

import * as React from 'react';

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';

import type { AppProps } from 'next/app';
import { ButtonConnect } from '../components/ButtonConnect';
import { ErrorBoundary } from 'react-error-boundary';
import Head from 'next/head';
import { Header } from '../components/Header';
import { Logo } from '../components/Logo';
import { Logtail } from '@logtail/browser';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Toaster } from 'react-hot-toast';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { handleErrors } from '../lib/handleErrors';
import { publicProvider } from 'wagmi/providers/public';
import splitbee from '@splitbee/web';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import { Nav } from '../components/Nav';

const logtailLocalEnvToken = 'uKVrtG2GMiZE66ahuBDAbnKF';

const { chains, provider } = configureChains(
  [chain.mainnet],
  [alchemyProvider({ alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'GOMINT',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      handleErrors(error as AxiosError);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      handleErrors(error as AxiosError);
    },
  }),
});

export const log = new Logtail(process.env.NEXT_PUBLIC_LOGGING || logtailLocalEnvToken);

if (process.env.NODE_ENV === 'production') {
  splitbee.init();
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  React.useEffect(() => storePathValues, [router.asPath]);

  function storePathValues() {
    const storage = window?.sessionStorage;
    if (!storage) return;

    const prevPath = storage.getItem('currentPath') || '';
    storage.setItem('prevPath', prevPath);
    storage.setItem('currentPath', window?.location.pathname);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        toastOptions={{
          duration: 5000,
          position: 'bottom-right',
          style: { borderRadius: 2, fontSize: 14, maxWidth: 400 },
        }}
      />
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <App>
            <Component {...pageProps} />
          </App>
        </RainbowKitProvider>
      </WagmiConfig>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

const App = ({ children }: { children: JSX.Element }) => {
  const router = useRouter();

  return (
    <>
      {router.pathname !== '/[project]' ? (
        <Head>
          <title>GOMINT — The Go-To-App to launch your NFT project</title>
          <meta
            name="description"
            content="Build quality NFT projects with proper access lists, smart contracts and minting websites. Forget about hiring a developer; instead, focus on what is important to you."
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
      ) : null}

      {router.asPath !== '/' && router.pathname !== '/[project]' && router.asPath !== '/explore' ? (
        <Header className="flex flex-col !py-6 lg:py-0 lg:flex-row">
          <div className="flex flex-col items-center lg:flex-row max-w-full">
            <Logo />
            <div className="mx-0 mt-6 mb-8 sm:mx-16 lg:my-0 max-w-full">
              <Nav />
            </div>
          </div>
          <div className="inline-flex xs:items-center flex-col xs:flex-row w-full xs:w-fit">
            <ButtonConnect />
          </div>
        </Header>
      ) : null}
      <ErrorBoundary onError={log.error} FallbackComponent={FallbackPage}>
        {children}
      </ErrorBoundary>
    </>
  );
};

const FallbackPage = () => (
  <div className="flex items-center justify-center h-full">
    Something went wrong. Try again later.
  </div>
);

export default MyApp;
