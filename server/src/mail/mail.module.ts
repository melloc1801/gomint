import { MailService } from "./mail.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { PugAdapter } from "@nestjs-modules/mailer/dist/adapters/pug.adapter";
import { join } from "lodash";

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        secure: false,
        auth: {
          user: process.env.MAIL_LOGIN,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: process.env.MAIL_LOGIN,
      },
      template: {
        dir: join(__dirname, "/templates"),
        adapter: new PugAdapter({
          inlineCssEnabled: true,
          inlineCssOptions: { url: " " },
        }),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  controllers: [],
  exports: [MailService],
})
export class MailModule {}
