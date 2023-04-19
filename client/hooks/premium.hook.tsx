import { useAccount, useContractRead, useContractWrite } from 'wagmi';

import fetcher from '../lib/fetcher';
import { queryClient } from '../pages/_app';
import toast from 'react-hot-toast';

export const usePremium = () => {
  const { isConnected } = useAccount();

  const price = useContractRead({
    ...contractParams,
    enabled: isConnected,
    functionName: 'price',
  });

  const mint = useContractWrite({
    ...contractParams,
    functionName: 'mint',
    overrides: {
      value: price.data,
    },
  });

  const mintAndVefiry = () =>
    mint
      .writeAsync()
      .then(() => fetcher({ method: 'GET', url: '/user/purchase/verification' }))
      .then(() => queryClient.invalidateQueries())
      .then(() => queryClient.refetchQueries());

  const buy = () => {
    toast.promise(
      mintAndVefiry(),
      {
        success: 'Success',
        loading: 'Purchasing',
        error: (e) => {
          const [errorMessage] = e.message.split('[');
          if (errorMessage) return errorMessage;
          return e.error ? e.error.message : e.message;
        },
      },
      {
        id: 'buy',
      }
    );
  };

  return {
    buy,
  };
};

const contractInterface = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  {
    inputs: [],
    name: 'price',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  { inputs: [], name: 'mint', outputs: [], stateMutability: 'payable', type: 'function' },
];

const contractParams = {
  contractInterface,
  addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
};
