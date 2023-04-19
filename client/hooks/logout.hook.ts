import fetcher from '../lib/fetcher';
import { queryClient } from '../pages/_app';
import { useDisconnect } from 'wagmi';

export const useLogout = () => {
  const { disconnect } = useDisconnect();

  const logout = async () => {
    await fetcher({
      url: '/auth/signout',
      method: 'GET',
    }).then(() => {
      disconnect();
      queryClient.invalidateQueries();
    });
  };

  return logout;
};
