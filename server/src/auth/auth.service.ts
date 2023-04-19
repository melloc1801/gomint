import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  CACHE_MANAGER,
  Inject,
} from "@nestjs/common";
import * as ethers from "ethers";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom, map } from "rxjs";
import { Cache } from "cache-manager";

import { getSignatureMessage } from "utils";
import { SigninAuthDto } from "./dto/auth.signin.dto";
import { AUTH_ERROR } from "./enum/auth-error.enum";
import { User as UserModel } from "@prisma/client";
import { PrismaService } from "../prisma.service";
import { v4 as uuidv4 } from "uuid";
import Twitter from "twitter-lite";
import { USER_ERROR } from "src/user/enum/user-error.enum";

@Injectable()
export class AuthService {
  constructor(
    private httpService: HttpService,
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async signin({ address, signature }: SigninAuthDto) {
    const user = await this.prisma.user.findFirst({ where: { address } });

    if (!user) {
      throw new NotFoundException();
    }

    if (user.banned) {
      throw new BadRequestException(USER_ERROR.BANNED);
    }

    const decodedAddress = ethers.utils.verifyMessage(
      getSignatureMessage({ address, nonce: user.nonce }),
      signature
    );

    if (decodedAddress !== address) {
      throw new UnauthorizedException();
    }

    await this.prisma.user.updateMany({
      where: { id: user.id },
      data: { nonce: uuidv4() },
    });

    return { address, userId: user.id };
  }

  async getDiscordLink(user: UserModel, client_redirect_uri: string) {
    const uuid = uuidv4();
    const state = JSON.stringify({
      uuid,
      client_redirect_uri,
    });
    await this.cacheManager.set(`discord${user.id}`, uuid, {
      ttl: 86400,
    });

    return `https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${process.env.DISCORD_CALLBACK_URI}&response_type=code&scope=identify%20guilds%20guilds.members.read&state=${state}`;
  }

  async unauthorizeDiscord(user: UserModel): Promise<void> {
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        discordUserId: null,
        discordUserName: null,
        discordAccessToken: null,
        discordRefreshToken: null,
      },
    });
  }

  async unauthorizeTwitter(user: UserModel): Promise<void> {
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        twitterUserId: null,
        twitterUserName: null,
        twitterAccessTokenKey: null,
        twitterAccessTokenSecret: null,
      },
    });
  }

  async authorizeDiscord(code: string, uuid: string, user: UserModel) {
    if (!code) throw new BadRequestException();
    if (!uuid) throw new BadRequestException();

    const nonce: string = await this.cacheManager.get(`discord${user.id}`);
    if (nonce !== uuid)
      throw new BadRequestException(AUTH_ERROR.AUTHORIZATION_LINK_EXPIRED);
    await this.cacheManager.del(`discord${user.id}`);

    const params = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      redirect_uri: process.env.DISCORD_CALLBACK_URI,
      grant_type: "authorization_code",
      code: code,
    });

    const { refresh_token, access_token } = await lastValueFrom(
      this.httpService
        .post(`${process.env.DISCORD_API}/oauth2/token`, params)
        .pipe(map((result) => result.data))
    ).catch(async (error) => {
      console.log(error);
      throw new BadRequestException();
    });

    const discordUser = await lastValueFrom(
      this.httpService
        .get(`${process.env.DISCORD_API}/users/@me`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .pipe(map((result) => result.data))
    ).catch(async (error) => {
      console.log(error);
      throw new BadRequestException();
    });

    const discordAccountInUse = await this.prisma.user.findFirst({
      where: {
        discordUserId: discordUser.id,
        NOT: {
          id: user.id,
        },
      },
    });

    if (discordAccountInUse) {
      throw new BadRequestException(USER_ERROR.DISCORD_ACCOUNT_IN_USE);
    }

    await this.prisma.user.updateMany({
      where: { id: user.id },
      data: {
        discordUserName: `${discordUser.username}#${discordUser.discriminator}`,
        discordRefreshToken: refresh_token,
        discordAccessToken: access_token,
        discordUserId: discordUser.id,
      },
    });
  }

  async getTwitterLink(client_redirect_uri: string) {
    const twitterClient = new Twitter({
      consumer_key: process.env.TWITTER_CLIENT_ID,
      consumer_secret: process.env.TWITTER_CLIENT_SECRET,
    });

    const tokens = await twitterClient
      .getRequestToken(
        process.env.TWITTER_CALLBACK_URI +
          `?client_redirect_uri=${encodeURIComponent(client_redirect_uri)}`
      )
      .catch((error) => {
        console.error(error);
        throw new BadRequestException();
      });

    if (tokens.oauth_callback_confirmed === "true") {
      return `https://api.twitter.com/oauth/authenticate?oauth_token=${tokens.oauth_token}`;
    }

    throw new BadRequestException();
  }

  async authorizeTwitter(
    oauthToken: string,
    oauthVerifier: string,
    user: UserModel
  ) {
    if (!oauthToken) throw new BadRequestException();
    if (!oauthVerifier) throw new BadRequestException();

    const twitterClient = new Twitter({
      consumer_key: process.env.TWITTER_CLIENT_ID,
      consumer_secret: process.env.TWITTER_CLIENT_SECRET,
    });

    const twitterAccount = await twitterClient
      .getAccessToken({
        oauth_verifier: oauthVerifier,
        oauth_token: oauthToken,
      })
      .catch((error) => {
        console.error(error);
        throw new BadRequestException();
      });

    const twitterAccountInUse = await this.prisma.user.findFirst({
      where: {
        twitterUserId: twitterAccount.user_id,
        NOT: {
          id: user.id,
        },
      },
    });

    if (twitterAccountInUse) {
      throw new BadRequestException(USER_ERROR.TWITTER_ACCOUNT_IN_USE);
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        twitterAccessTokenKey: twitterAccount.oauth_token,
        twitterAccessTokenSecret: twitterAccount.oauth_token_secret,
        twitterUserName: `@${twitterAccount.screen_name}`,
        twitterUserId: twitterAccount.user_id,
      },
    });
  }
}
