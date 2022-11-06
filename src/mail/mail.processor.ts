import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('mail')
export class MailProcessor {
  private logger = new Logger(this.constructor.name);

  constructor(private readonly mailerService: MailerService) {}

  @Process('send-email')
  async sendConfirmationEmail(
    job: Job<{
      to: string;
      subject: string;
      template: string;
      context: Record<string, any>;
    }>,
  ) {
    const { to, subject, template, context } = job.data;
    const result = await this.mailerService.sendMail({
      to,
      subject,
      template,
      context,
    });

    return result;
  }
}
