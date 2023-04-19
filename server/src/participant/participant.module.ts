import { CacheModule, Module } from "@nestjs/common";

import { HttpModule } from "@nestjs/axios";
import { MailModule } from "src/mail/mail.module";
import { ParticipantController } from "./participant.controller";
import { ParticipantService } from "./participant.service";
import { PrismaService } from "../prisma.service";
import { UserService } from "src/user/user.service";

@Module({
  providers: [ParticipantService, PrismaService, UserService],
  controllers: [ParticipantController],
  imports: [HttpModule, MailModule, CacheModule.register()],
})
export class ParticipantModule {}
