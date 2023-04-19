import * as path from "path";

import { BadRequestException, Injectable } from "@nestjs/common";

import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmailVerificationLink(email: string, code: string): Promise<void> {
    await this.mailerService
      .sendMail({
        to: email,
        subject: "GOMINT. Email verification",
        template: this.getTemplateLink("userVerificationCodeEmail"),
        context: {
          link: path.join(process.env.FE_URL, `/auth/email?code=${code}`),
        },
      })
      .catch((e) => {
        console.error(e);
        throw new BadRequestException();
      });
  }

  private getTemplateLink(name: string) {
    return path.join(path.resolve(), `src/mail/templates/${name}.pug`);
  }
}
