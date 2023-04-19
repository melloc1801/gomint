import { CacheModule, Module } from "@nestjs/common";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { HttpModule } from "@nestjs/axios";
import { PassportModule } from "@nestjs/passport";
import { PrismaService } from "../prisma.service";
import { Web3AuthStrategy } from "./auth.strategy";

@Module({
  controllers: [AuthController],
  providers: [AuthService, Web3AuthStrategy, PrismaService],
  imports: [CacheModule.register(), PassportModule, HttpModule],
})
export class AuthModule {}
