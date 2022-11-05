import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';
import { User } from 'src/user/schemas/user.schema';

@Processor('mail')
export class MailProcessor {
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  @Process('confirmation')
  async sendConfirmationEmail(job: Job<{ user: User; token: string }>) {
    const { user, token } = job.data;

    const url = `${this.configService.get('FRONTEND_URL')}/${token}`;

    const result = await this.mailerService.sendMail({
      to: user.email,
      subject: `${this.configService.get(
        'APP_NAME',
      )} | Please Confirm Your Email`,
      template: './email-confirmation',
      context: {
        name: user.name,
        url,
      },
    });

    return result;
  }

  @Process('forgotPassword')
  async sendForgotPasswordEmail(job: Job<{ user: User; token: string }>) {
    const { user, token } = job.data;
    const url = `this.configService.get('FRONTEND_URL')/${token}`;
    const result = await this.mailerService.sendMail({
      to: user.email,
      subject: `${this.configService.get('APP_NAME')} | Reset Password`,
      template: './forgot-password',
      context: {
        name: user.name,
        url,
      },
    });

    return result;
  }
}
