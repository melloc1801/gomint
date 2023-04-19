import { TransformFnParams } from "class-transformer";

export const getRandomNonce = () => Math.floor(Math.random() * 1_000_000);

export const getSignatureMessage = ({
  address,
  nonce,
}: {
  address: string;
  nonce: string;
}) => {
  return `
Signing is the only way we can truly know that you
are the owner of the wallet you are connecting.

Signing is a safe, gas-less and does not in any way
give permission to perform any transactions with
your wallet.

Wallet address:
${address}

Nonce:
${nonce}`.trim();
};

export const trim = ({ value }: TransformFnParams) => value?.trim();
