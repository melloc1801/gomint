import { CacheModule, Module } from "@nestjs/common";
import { MeController, UsersController } from "./user.controller";

import { MailModule } from "src/mail/mail.module";
import { PrismaService } from "../prisma.service";
import { UserService } from "./user.service";

@Module({
  providers: [UserService, PrismaService],
  controllers: [UsersController, MeController],
  imports: [MailModule, CacheModule.register()],
})
export class UserModule {}
