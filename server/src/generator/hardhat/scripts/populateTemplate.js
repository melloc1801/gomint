// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
import { ethers } from "hardhat";
import fs from "fs";
import path from "path";
import { populate } from "../../utils/populate";

export const __CONTRACT_NAME__ = "TEST_CONTRACT_NAME";

async function main() {
  const [
    ownerAccount,
    signerAccount,
    controllerAccount,
    sideAccount1,
    sideAccount2,
  ] = await ethers.getSigners();

  const __SUPPLY__ = 10;
  const __PRICE__ = 0.001;
  const __NAME__ = "TEST_NAME";
  const __MAX_PER_WALLET__ = 2;
  const __ROYALTY_AMOUNT__ = 50;
  const __SYMBOL__ = "TEST_SYMBOL";
  const __MAX_PER_TRANSACTION__ = 1;
  const __WITHDRAW_SHARES__ = "[10, 90]";
  const __BASE_TOKEN_URI__ = "BASE_TOKEN_URI";
  const withdrawAccount1 = sideAccount1;
  const withdrawAccount2 = sideAccount2;

  const Template = fs.readFileSync(
    path.resolve("src/generator", "Template.sol"),
    "utf8"
  );

  const populateFields = {
    __NAME__,
    __PRICE__,
    __SYMBOL__,
    __SUPPLY__,
    __MAX_PER_WALLET__,
    __BASE_TOKEN_URI__,
    __ROYALTY_AMOUNT__,
    __CONTRACT_NAME__,
    __WITHDRAW_SHARES__,
    __MAX_PER_TRANSACTION__,
    __SIGNER__: signerAccount.address,
    __CONTROLLER__: controllerAccount.address,
    //Please add at least two addresses for test to work correctly
    __WITHDRAW_ADDRESSES__: `[${withdrawAccount1.address}, ${withdrawAccount2.address}]`,
  };

  const populatedContract = populate(Template, populateFields);

  fs.writeFileSync(
    "src/generator/contracts/PopulatedTemplate.sol",
    populatedContract
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
