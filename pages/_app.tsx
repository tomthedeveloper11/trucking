import '../styles/global.css';
import { AppProps } from 'next/app';
import { TruckContext } from '../lib/context';
import { ToastContextProvider } from '../lib/toast-context';
import SidebarComponent from '../components/sidebar';
import { useEffect, useState } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';

export default function App({ Component, pageProps, router }: AppProps) {
  const routes = ['home', 'trucks', 'misc', 'customers', 'register'];
  let showSidebar = false;

  if (routes.some((substring) => router.pathname.includes(substring))) {
    showSidebar = true;
  }
  const [pageLoading, setPageLoading] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const handleStart = () => {
      setPageLoading(true);
    };
    const handleComplete = () => {
      setPageLoading(false);
    };
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);
  }, [router]);
  if (!mounted) return null;

  return (
    <>
      <ToastContextProvider>
        <TruckContext.Provider value={[]}>
          <div className="flex">
            {showSidebar && <SidebarComponent />}
            {pageLoading ? (
              <div className="sweet-loading m-auto pt-[45vh]">
                <BeatLoader color={'#54BAB9'} loading={pageLoading} size={20} speedMultiplier={0.8} />
              </div>
            ) : (
              <Component {...pageProps} />
            )}
          </div>
        </TruckContext.Provider>
      </ToastContextProvider>
    </>
  );
}
