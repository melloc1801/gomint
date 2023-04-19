import {
  BadRequestException,
  Injectable,
  Inject,
  CACHE_MANAGER,
} from "@nestjs/common";
import { Cache } from "cache-manager";

import { CreateUserDto } from "./dto/user.create.dto";
import { GetUserDto } from "./dto/get-user.dto";
import { PrismaService } from "../prisma.service";
import { User as UserModel } from "@prisma/client";
import { getBalance } from "utils/alchemy";
import { plainToClass } from "class-transformer";
import { v4 as uuidv4 } from "uuid";
import { MailService } from "src/mail/mail.service";
import { ChangeEmailPayload } from "./type/change-email-payload.type";
import { USER_ERROR } from "./enum/user-error.enum";
import { MAX_WALLLET_AMOUNT, TIER_TYPES } from "./user.constant";
import { ethers } from "ethers";
import { UpdateUserDto } from "./dto/user.update.dto";
import { AddWalleltDto } from "./dto/add-wallet.dto";
import { getSignatureMessage } from "utils";
import { DeleteWalleltDto } from "./dto/delete-wallet.dto";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async create(createUserDto: CreateUserDto): Promise<GetUserDto> {
    createUserDto.address = ethers.utils.getAddress(createUserDto.address);
    const premiumTier = await this.prisma.tier.findFirst({
      where: { type: TIER_TYPES.FREE },
    });
    const user = this.prisma.user
      .upsert({
        where: {
          address: createUserDto.address,
        },
        update: {},
        create: { ...createUserDto, tier: { connect: { id: premiumTier.id } } },
      })
      .catch((error) => {
        console.log(error);
        throw new BadRequestException();
      });

    return plainToClass(GetUserDto, user);
  }

  async getWeiBalance(id: number) {
    const user = await this.prisma.user.findUnique({
      select: { address: true },
      where: {
        id,
      },
    });

    return await getBalance(user.address);
  }

  async updateUser(
    user: UserModel,
    updateUserDto: UpdateUserDto
  ): Promise<void> {
    const { email, username } = updateUserDto;

    if (username) {
      const usedUsername = await this.prisma.user.findFirst({
        where: { username: username },
      });

      if (usedUsername) {
        throw new BadRequestException(USER_ERROR.USERNAME_IN_USE);
      }
    }

    if (email) {
      const code = uuidv4();
      const changeEmailPayload: ChangeEmailPayload = {
        email,
        address: user.address,
      };

      await this.cacheManager.set(code, JSON.stringify(changeEmailPayload), {
        ttl: 86400,
      });

      await this.mailService.sendEmailVerificationLink(email, code);
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email: email ? email : undefined,
        emailVerified: email ? false : undefined,
        ...updateUserDto,
      },
    });
  }

  async verifyEmail(code: string, user: UserModel): Promise<void> {
    const rawChangeEmailPayload = await this.cacheManager.get(code);
    if (!rawChangeEmailPayload) {
      throw new BadRequestException(USER_ERROR.EMAIL_VERIFICATION_CODE_EXPIRED);
    }

    const changeEmailPayload: ChangeEmailPayload = JSON.parse(
      rawChangeEmailPayload as string
    );

    if (user.address !== changeEmailPayload.address) {
      throw new BadRequestException();
    }

    if (user.email !== changeEmailPayload.email) {
      throw new BadRequestException(USER_ERROR.EMAIL_VERIFICATION_CODE_EXPIRED);
    }

    await this.cacheManager.del(code);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });
  }

  async verifyPurchase(user: UserModel): Promise<void> {
    const ABI = [
      { inputs: [], stateMutability: "nonpayable", type: "constructor" },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "approved",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            indexed: false,
            internalType: "bool",
            name: "approved",
            type: "bool",
          },
        ],
        name: "ApprovalForAll",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "previousOwner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "OwnershipTransferred",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "Paused",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "Unpaused",
        type: "event",
      },
      {
        inputs: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
        ],
        name: "approve",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "baseTokenURI",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
        name: "getApproved",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "operator", type: "address" },
        ],
        name: "isApprovedForAll",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "maxSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "mint",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "", type: "address" }],
        name: "minters",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
        name: "ownerOf",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "paused",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "price",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "from", type: "address" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "from", type: "address" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "bytes", name: "data", type: "bytes" },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "operator", type: "address" },
          { internalType: "bool", name: "approved", type: "bool" },
        ],
        name: "setApprovalForAll",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "string", name: "_baseTokenURI", type: "string" },
        ],
        name: "setBaseTokenURI",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "_maxSupply", type: "uint256" },
        ],
        name: "setMaxSupply",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "_price", type: "uint256" }],
        name: "setPrice",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "bytes4", name: "interfaceId", type: "bytes4" },
        ],
        name: "supportsInterface",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
        name: "teamMint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "togglePause",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
        name: "tokenURI",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "from", type: "address" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "newOwner", type: "address" },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "_receiver", type: "address" },
          { internalType: "uint256", name: "_amount", type: "uint256" },
        ],
        name: "withdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];

    const provider = new ethers.providers.AlchemyProvider(
      ethers.providers.getNetwork(1),
      process.env.ALCHEMY_KEY
    );

    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      ABI,
      provider
    );

    const userChecksumAddress = ethers.utils.getAddress(user.address);
    await new Promise((resolve) => setTimeout(resolve, 250));
    const isMinter = await contract.minters(userChecksumAddress);

    if (isMinter) {
      const premiumTier = await this.prisma.tier.findFirst({
        where: { type: TIER_TYPES.PREMIUM },
      });

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          tier: { connect: { id: premiumTier.id } },
        },
      });
    } else {
      throw new BadRequestException(USER_ERROR.NOT_MINTER);
    }
  }

  async addWallet(
    user: UserModel,
    { address, signature, label }: AddWalleltDto
  ) {
    const userWalletsAmount = await this.prisma.wallet.count({
      where: { userId: user.id },
    });

    if (userWalletsAmount + 1 > MAX_WALLLET_AMOUNT) {
      throw new BadRequestException(
        `Can't add more then ${MAX_WALLLET_AMOUNT} wallets`
      );
    }

    const walletInUse = await this.prisma.wallet.findFirst({
      where: { address },
    });

    if (walletInUse) {
      throw new BadRequestException(USER_ERROR.WALLET_IN_USE);
    }

    const decodedAddress = ethers.utils.verifyMessage(
      getSignatureMessage({ address, nonce: user.nonce }),
      signature
    );

    if (decodedAddress !== address) {
      throw new BadRequestException();
    }

    await this.prisma.user.updateMany({
      where: { id: user.id },
      data: { nonce: uuidv4() },
    });

    await this.prisma.wallet.create({
      data: { address: address, userId: user.id, label },
    });
  }

  async deleteWallet({ address }: DeleteWalleltDto) {
    await this.prisma.wallet.delete({
      where: { address },
    });
  }
}
