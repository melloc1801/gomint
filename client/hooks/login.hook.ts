import { useAccount, useDisconnect, useSignMessage } from 'wagmi';

import fetcher from '../lib/fetcher';
import { getMessage } from '../lib/getMessage';
import { queryClient } from '../pages/_app';

export const useLogin = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  const login = async () => {
    const user = await fetcher<{ address: string; nonce: number }>({
      url: '/user',
      method: 'POST',
      data: {
        address,
      },
    });

    let signature;

    try {
      signature = await signMessageAsync({ message: getMessage(user) });
    } catch {
      disconnect();
      throw Error('Invalid signature');
    }

    await fetcher({
      method: 'POST',
      url: '/auth/signin',
      data: {
        address,
        signature,
      },
    });

    queryClient.invalidateQueries();
  };

  return login;
};
