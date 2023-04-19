import { createAlchemyWeb3 } from "@alch/alchemy-web3";
require("dotenv-flow").config();

export const { getBalance } = createAlchemyWeb3(
  process.env.ETHEREUM_PROVIDER_URL!
).eth;
