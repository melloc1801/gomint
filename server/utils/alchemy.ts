import { createAlchemyWeb3 } from "@alch/alchemy-web3";

export const { getBalance } = createAlchemyWeb3(
  process.env.ETHEREUM_PROVIDER_URL
).eth;

export const { getNfts } = createAlchemyWeb3(
  process.env.ETHEREUM_PROVIDER_URL
).alchemy;
