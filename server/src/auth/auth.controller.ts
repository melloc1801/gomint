import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Res,
  Session,
  UseGuards,
} from "@nestjs/common";

import { AuthGuard } from "./guard/auth.guard";
import { AuthService } from "./auth.service";
import { GetUser } from "src/user/decorator/get-user.decorator";
import { SigninAuthDto } from "./dto/auth.signin.dto";
import { UserGuard } from "src/user/guard/user.guard";
import { User as UserModel } from "@prisma/client";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signin")
  async signin(
    @Body() signinAuthDto: SigninAuthDto,
    @Session() session: Record<string, unknown>
  ) {
    const { address, userId } = await this.authService.signin(signinAuthDto);
    session.userId = userId;
    session.address = address;

    return { address };
  }

  @UseGuards(AuthGuard, UserGuard)
  @Get("discord")
  async authorizeDiscord(
    @Query("code") code: string,
    @Query("uuid") uuid: string,
    @GetUser() user: UserModel
  ) {
    return this.authService.authorizeDiscord(code, uuid, user);
  }

  @UseGuards(AuthGuard, UserGuard)
  @Patch("discord-disconnect")
  async unauthorizeDiscord(@GetUser() user: UserModel) {
    return this.authService.unauthorizeDiscord(user);
  }

  @UseGuards(AuthGuard, UserGuard)
  @Patch("twitter-disconnect")
  async unauthorizeTwitter(@GetUser() user: UserModel) {
    return this.authService.unauthorizeTwitter(user);
  }

  @UseGuards(AuthGuard, UserGuard)
  @Get("discord-link")
  async getDiscordLink(
    @GetUser() user: UserModel,
    @Query("client_redirect_uri") client_redirect_uri: string
  ) {
    return this.authService.getDiscordLink(user, client_redirect_uri);
  }

  @UseGuards(AuthGuard, UserGuard)
  @Get("twitter")
  async authorizeTwitter(
    @Query("oauth_token") oauthToken: string,
    @Query("oauth_verifier") oauthVerifier: string,
    @GetUser() user: UserModel
  ): Promise<void> {
    return this.authService.authorizeTwitter(oauthToken, oauthVerifier, user);
  }

  @UseGuards(AuthGuard, UserGuard)
  @Get("twitter-link")
  async getTwitterLink(
    @Query("client_redirect_uri") client_redirect_uri: string
  ) {
    return this.authService.getTwitterLink(client_redirect_uri);
  }

  @Get("signout")
  signout(@Session() session, @Res() res) {
    session.destroy((err) => {
      if (err) res.json({ error: "Signout falied!" });
    });

    res.clearCookie(process.env.SESSION_NAME);
    res.json();
  }
}
