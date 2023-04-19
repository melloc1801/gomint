import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from "@nestjs/common";

import { AuthGuard } from "src/auth/guard/auth.guard";
import { GetUser } from "./decorator/get-user.decorator";

import { CreateUserDto } from "./dto/user.create.dto";
import { UserGuard } from "./guard/user.guard";
import { UserService } from "./user.service";
import { User as UserModel } from "@prisma/client";
import { GetUserDto } from "./dto/get-user.dto";
import { TIER_TYPES, USER_QUERY_PARAMS } from "./user.constant";
import { PrismaService } from "src/prisma.service";
import { UpdateUserDto } from "./dto/user.update.dto";
import { AddWalleltDto } from "./dto/add-wallet.dto";
import { DeleteWalleltDto } from "./dto/delete-wallet.dto";

@Controller("me")
export class MeController {
  constructor(private prisma: PrismaService) {}

  @UseGuards(AuthGuard, UserGuard)
  @Get()
  async me(
    @Session() session: Record<string, unknown>,
    @GetUser() user: UserModel
  ) {
    const userWithRelations = await this.prisma.user.findFirst({
      include: { tier: true, wallets: true },
      where: { id: user.id },
    });

    return {
      email: user.email,
      nonce: user.nonce,
      username: user.username,
      address: session.address,
      canCreateProject: user.active,
      discordAuthorized: Boolean(user.discordAccessToken),
      twitterAuthorized: Boolean(user.twitterAccessTokenKey),
      emailAuthorized: user.emailVerified,
      premium: userWithRelations.tier.type === TIER_TYPES.PREMIUM,
      wallets: userWithRelations.wallets.map((wallet) => ({
        address: wallet.address,
        label: wallet.label,
      })),
    };
  }
}

@Controller("user")
export class UsersController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<GetUserDto> {
    return this.userService.create(createUserDto);
  }

  @Post("wallet")
  @UseGuards(AuthGuard, UserGuard)
  addWallet(
    @Body() addWalletDto: AddWalleltDto,
    @GetUser() user: UserModel
  ): Promise<void> {
    return this.userService.addWallet(user, addWalletDto);
  }

  @Delete("wallet")
  @UseGuards(AuthGuard, UserGuard)
  deleteWallet(@Body() deleteWalleltDto: DeleteWalleltDto): Promise<void> {
    return this.userService.deleteWallet(deleteWalleltDto);
  }

  @UseGuards(AuthGuard)
  @Get("balance")
  async getWeiBalance(
    @Session() session: Record<"userId", number>
  ): Promise<string> {
    return this.userService.getWeiBalance(session.userId);
  }

  @Patch()
  @UseGuards(AuthGuard, UserGuard)
  updateUser(
    @GetUser() user: UserModel,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<void> {
    return this.userService.updateUser(user, updateUserDto);
  }

  @Post("email/verification")
  @UseGuards(AuthGuard, UserGuard)
  verifyEmail(
    @GetUser() user: UserModel,
    @Query(USER_QUERY_PARAMS.CODE) code: string
  ): Promise<void> {
    return this.userService.verifyEmail(code, user);
  }

  @Get("purchase/verification")
  @UseGuards(AuthGuard, UserGuard)
  verifyPurchase(@GetUser() user: UserModel): Promise<void> {
    return this.userService.verifyPurchase(user);
  }
}
