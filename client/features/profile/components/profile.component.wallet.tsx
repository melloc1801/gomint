import { DocumentDuplicateIcon, IdentificationIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useAccount, useSignMessage } from 'wagmi';

import { Button } from '../../../components/Button';
import { Formik } from 'formik';
import { InputField } from '../../../components/InputField';
import { Label } from '../../../components/Label';
import { Typography } from '../../../components/Typography';
import { WalletValidation } from '../utils/profile.utils.validation';
import { formatAddress } from '../../phase/utils/phase.utils.helpers';
import { getMessage } from '../../../lib/getMessage';
import toast from 'react-hot-toast';
import { useProfile } from '../hooks/profile.hook.me';
import { useWallet } from '../hooks/profile.hook.wallet';

export const ProfileWallet = () => {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const profile = useProfile();
  const wallet = useWallet();

  const initialEmailValue = address || '';

  const isConnected =
    profile.data?.address === address ||
    profile.data?.wallets.some((wallet) => wallet.address === address);

  return profile.isSuccess ? (
    <div>
      <Formik
        enableReinitialize
        validationSchema={WalletValidation}
        initialValues={{ address: initialEmailValue, label: '' }}
        onSubmit={async (values, { resetForm }) => {
          if (address) {
            const signature = await signMessageAsync({
              message: getMessage({ address: address, nonce: profile.data.nonce }),
            });
            await wallet.add.mutateAsync({ signature, address, label: values.label });
            resetForm();
          }
        }}>
        {(props) => (
          <div className="container mx-auto">
            <div>
              <Label title="Account registration wallet">
                <span className="block mb-8 font-bold">{profile.data.address}</span>
              </Label>
              <form id="wallet-form" onSubmit={props.handleSubmit}>
                <InputField
                  disabled
                  type="text"
                  name="address"
                  placeholder=""
                  title="Current active wallet"
                />
                <InputField
                  type="text"
                  name="label"
                  icon={IdentificationIcon}
                  title="Wallet name"
                  placeholder="Name your wallet e.g. Ledger Nano S"
                />
              </form>
              <Button className="my-2" disabled={isConnected} type="submit" form="wallet-form">
                {isConnected ? 'Wallet connected' : 'Connect wallet'}
              </Button>
            </div>
          </div>
        )}
      </Formik>

      {profile.data.wallets?.length ? (
        <div className="grid gap-2 mt-3">
          <Typography variant="label" className="block mt-4 mb-1">
            Connected wallets
          </Typography>
          {profile.data.wallets?.map((userWallet, index) => (
            <div
              key={userWallet.address + index}
              className="flex items-center justify-between px-3 py-2.5 mb-1 border rounded">
              <div className="col-span-10 group">
                <div
                  className="flex items-center group-hover:cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(userWallet.address);
                    toast('Address copied to clipboard', { id: userWallet.address });
                  }}>
                  <span>
                    {userWallet.label
                      ? `${userWallet.label} - ${formatAddress(userWallet.address)}`
                      : formatAddress(userWallet.address)}
                  </span>
                  <DocumentDuplicateIcon className="hidden w-4 h-4 ml-1 text-slate-300 group-hover:inline" />
                </div>
              </div>
              <div className="col-span-2 lg:col-span-2 justify-self-center">
                <button
                  className="flex items-center justify-center w-5 h-5 bg-red-100 rounded-full"
                  onClick={() => wallet.remove.mutateAsync({ address: userWallet.address })}>
                  <PlusIcon className="w-3 h-3 rotate-45 opacity-50 text-gomint-red hover:opacity-100" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  ) : null;
};
