import { BigNumber } from "ethers";
import { __CONTRACT_NAME__ } from "../scripts/populateTemplate";
import { ethers } from "hardhat";
import { expect } from "chai";

describe("PopulatedTemplate.sol", function () {
  let contract;
  let sideAccount1;
  let sideAccount2;
  let ownerAccount;
  let signerAccount;
  let controllerAccount;
  let withdrawAccount1;
  let withdrawAccount2;

  let price;
  let supply;
  let maxPerWallet;
  let maxPerTransaction;

  const CLOSED_MINT_STATUS_CODE = 0;
  const PUBLIC_MINT_STATUS_CODE = 1;
  const PRIVATE_MINT_STATUS_CODE = 2;

  // type MintRequest = {
  //   signerAccount: any;
  //   amount: number;
  //   price: BigNumber;
  //   to: string;
  // };

  async function signMintRequest(mintRequest) {
    const { amount, price, to, signerAccount } = mintRequest;
    const mintRequestArray = [to, amount, price];
    const messageHash = ethers.utils.solidityKeccak256(
      ["address", "uint256", "uint256"],
      mintRequestArray
    );
    const messageHashBinary = ethers.utils.arrayify(messageHash);
    const signature = await signerAccount.signMessage(messageHashBinary);
    return signature;
  }

  beforeEach(async () => {
    [
      ownerAccount,
      signerAccount,
      controllerAccount,
      sideAccount1,
      sideAccount2,
    ] = await ethers.getSigners();

    const contractFactory = await ethers.getContractFactory(__CONTRACT_NAME__);
    contract = await contractFactory.deploy();
    await contract.deployTransaction.wait();

    withdrawAccount1 = sideAccount1;
    withdrawAccount2 = sideAccount2;
    price = (await contract.functions.price())[0];
    supply = (await contract.functions.supply())[0];
    maxPerWallet = (await contract.functions.maxPerWallet())[0];
    maxPerTransaction = (await contract.functions.maxPerTransaction())[0];
  });

  //MINT STATUS
  it("Should set mint status to closed by default", async function () {
    expect(await contract.mintStatus()).eq(CLOSED_MINT_STATUS_CODE);
  });

  it("Should rever when non-onwer attempt to change mint status", async function () {
    await expect(
      contract.connect(sideAccount1).setMintStatus(PUBLIC_MINT_STATUS_CODE)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should set correct mint status on change", async function () {
    await contract.setMintStatus(PUBLIC_MINT_STATUS_CODE);
    expect(await contract.connect(ownerAccount).mintStatus()).eq(
      PUBLIC_MINT_STATUS_CODE
    );
  });

  //BASE TOKEN URI
  it("Should have base token URI by default", async function () {
    const baseTokenUri = (await contract.functions.baseTokenURI())[0];
    expect(baseTokenUri).exist;
  });

  it("Should rever when non-onwer attempt to set base token URI", async function () {
    const newBaseTokenUri = "newBaseTokenUri";
    await expect(
      contract.connect(sideAccount1).setBaseURI(newBaseTokenUri)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should set correct base token URI", async function () {
    const newBaseTokenUri = "newBaseTokenUri";
    await contract.connect(ownerAccount).setBaseURI(newBaseTokenUri);
    const baseTokenUri = (await contract.functions.baseTokenURI())[0];
    expect(baseTokenUri).eq(newBaseTokenUri);
  });

  //SIGNER, CONTROLLER
  it("Should have signer and controller by default", async function () {
    const signer = (await contract.functions.signer())[0];
    const controller = (await contract.functions.controller())[0];

    expect(signer).to.be.properAddress;
    expect(controller).to.be.properAddress;
  });

  it("Should rever when non-controller attempt to change signer", async function () {
    await expect(
      contract.connect(sideAccount1).setSigner(sideAccount1.address)
    ).to.be.revertedWith("Not controller");
  });

  it("Should set correct signer when controller set signer", async function () {
    await contract.connect(controllerAccount).setSigner(sideAccount1.address);
    const currentSigner = (await contract.functions.signer())[0];
    expect(currentSigner).eq(sideAccount1.address);
  });

  //PUBLIC MINT
  it("Should revert public mint when mint status in not public", async function () {
    await expect(contract.mint(1, { value: price })).to.be.revertedWith(
      "Mint inactive"
    );
  });

  it("Should revert public mint when price is invalid", async function () {
    await contract.setMintStatus(PUBLIC_MINT_STATUS_CODE);
    await expect(contract.mint(1, { value: price.sub(1) })).to.be.revertedWith(
      "Invalid price"
    );
  });

  it("Should revert public mint when mint amound exceeds max per transaction", async function () {
    await contract.setMintStatus(PUBLIC_MINT_STATUS_CODE);
    const incrementedMaxPerTx = maxPerTransaction.add(1);
    const priceForIncrementedMaxPerTx = incrementedMaxPerTx.mul(price);

    await expect(
      contract.mint(incrementedMaxPerTx, {
        value: priceForIncrementedMaxPerTx,
      })
    ).to.be.revertedWith("Max per tx");

    await contract.setPerTransactionMax(incrementedMaxPerTx);
    await expect(
      contract.mint(incrementedMaxPerTx, {
        value: priceForIncrementedMaxPerTx,
      })
    ).to.be.not.revertedWith("Max per tx");
  });

  it("Should revert public mint when mint amound exceeds max per wallet", async function () {
    await contract.setPerTransactionMax(maxPerWallet);
    const priceForMaxPerWallet = maxPerWallet.mul(price);
    await contract.setMintStatus(PUBLIC_MINT_STATUS_CODE);
    await contract.mint(maxPerWallet, { value: priceForMaxPerWallet });

    await expect(contract.mint(1, { value: price })).to.be.revertedWith(
      "Max per wallet"
    );

    await contract.setPerWalletMax(maxPerWallet.add(1));
    await expect(contract.mint(1, { value: price })).to.be.not.revertedWith(
      "Max per wallet"
    );
  });

  it("Should revert public mint when new minted amount do not fit supply", async function () {
    await contract.setPerWalletMax(supply);
    await contract.setPerTransactionMax(supply);
    await contract.setMintStatus(PUBLIC_MINT_STATUS_CODE);

    const incrementedSupply = supply.add(1);
    const incrementedSupplyPrice = incrementedSupply.mul(price);

    await expect(
      contract.mint(incrementedSupply, { value: incrementedSupplyPrice })
    ).to.be.revertedWith("Out of supply");
  });

  it("Should set correct token owner on public mint", async function () {
    await contract.setMintStatus(PUBLIC_MINT_STATUS_CODE);
    await contract.connect(sideAccount1).mint(1, { value: price });

    expect(await contract.ownerOf(0)).eq(sideAccount1.address);
  });

  //TEAM MINT
  it("Should revert when non-owner do team mint", async function () {
    await expect(
      contract.connect(sideAccount1).teamMint(1, sideAccount1.address)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should set correct token owner on team mint", async function () {
    await contract.connect(ownerAccount).teamMint(1, sideAccount1.address);
    expect(await contract.ownerOf(0)).eq(sideAccount1.address);
  });

  //PRIVATE MINT
  it("Should revert private mint when mint status in not private", async function () {
    const amount = 1;
    const to = ownerAccount.address;
    const signature = signMintRequest({ to, amount, price, signerAccount });

    await expect(
      contract
        .connect(ownerAccount)
        .privateMint({ to, amount, price }, signature, { value: price })
    ).to.be.revertedWith("Private mint inactive");
  });

  it("Should revert private mint when signer is not the one specified in contract", async function () {
    await contract.setMintStatus(PRIVATE_MINT_STATUS_CODE);

    const amount = 1;
    const to = ownerAccount.address;
    const signature = signMintRequest({
      to,
      amount,
      price,
      signerAccount: sideAccount1,
    });

    await expect(
      contract
        .connect(ownerAccount)
        .privateMint({ to, amount, price }, signature, { value: price })
    ).to.be.revertedWith("Mint request invalid");
  });

  it("Should set correct token owner on private mint", async function () {
    await contract.setMintStatus(PRIVATE_MINT_STATUS_CODE);

    const amount = 1;
    const to = sideAccount1.address;
    const signature = signMintRequest({ to, amount, price, signerAccount });

    await contract
      .connect(ownerAccount)
      .privateMint({ to, amount, price }, signature, {
        value: price,
      });

    expect(await contract.ownerOf(0)).eq(to);
  });

  //ROYALTY
  it("Should set correct royalty", async function () {
    //9000 is 90% of price sent when denominator of price is set to 10000
    await contract
      .connect(ownerAccount)
      .setRoyaltyInfo(ownerAccount.address, 9000);
    const royaltyInfo = await contract
      .connect(ownerAccount)
      .royaltyInfo(1, price);

    expect(royaltyInfo[0]).eq(ownerAccount.address);
    expect(royaltyInfo[1]).eq(price.mul(90).div(100));
  });

  //WITHDRAW
  it("Should have withdraw addresses and shares", async function () {
    const withdrawAddress1 = (await contract.functions.withdrawAddresses(0))[0];
    const withdrawAddress2 = (await contract.functions.withdrawAddresses(1))[0];
    const withdrawShare1 = (await contract.functions.withdrawShares(0))[0];
    const withdrawShare2 = (await contract.functions.withdrawShares(1))[0];

    expect(withdrawAddress1).to.be.properAddress;
    expect(withdrawAddress2).to.be.properAddress;
    expect(withdrawShare1).above(0).below(100);
    expect(withdrawShare2).above(0).below(100);
  });

  it("Should revert when non-owner do withdraw", async function () {
    await expect(contract.connect(sideAccount1).withdraw()).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });

  it("Should withdraw according withdraw shares", async function () {
    await contract.connect(ownerAccount).setMintStatus(PUBLIC_MINT_STATUS_CODE);
    await contract.connect(ownerAccount).mint(1, { value: price });

    const withdrawShare1 = (await contract.functions.withdrawShares(0))[0];
    const withdrawShare2 = (await contract.functions.withdrawShares(1))[0];

    const contractBalanceChange = ethers.BigNumber.from(-price);
    const withdrawAccount1BalanceChange = price.mul(withdrawShare1).div(100);
    const withdrawAccount2BalanceChange = price.mul(withdrawShare2).div(100);

    await expect(await contract.withdraw()).to.changeEtherBalances(
      [contract, withdrawAccount1, withdrawAccount2],
      [
        contractBalanceChange,
        withdrawAccount1BalanceChange,
        withdrawAccount2BalanceChange,
      ]
    );
  });
});
