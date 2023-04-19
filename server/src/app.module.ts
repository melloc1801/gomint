import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { FileModule } from "./file/file.module";
import { MailModule } from "./mail/mail.module";
import { Module } from "@nestjs/common";
import { ParticipantModule } from "./participant/participant.module";
import { PhaseModule } from "./phase/phase.module";
import { ProjectModule } from "./project/project.module";
import { ReportModule } from "./report/report.module";
import { UserModule } from "./user/user.module";

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  controllers: [],
  imports: [
    ThrottlerModule.forRoot({
      ttl: parseInt(process.env.TTL) || 60,
      limit: parseInt(process.env.LIMIT) || 60,
    }),
    AuthModule,
    UserModule,
    FileModule,
    PhaseModule,
    ProjectModule,
    ParticipantModule,
    ReportModule,
    MailModule,
  ],
})
export class AppModule {}
