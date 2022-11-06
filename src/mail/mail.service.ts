import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bull';

@Injectable()
export class MailService {
  private logger = new Logger(this.constructor.name);

  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
    @InjectQueue('mail')
    private mailQueue: Queue,
  ) {}

  // Handles sending of mails
  sendMail(
    sendMailData: {
      to: string;
      subject: string;
      template: string;
      context: Record<string, any>;
    },

    // queueJobName: string,
  ): Promise<any> {
    const { to, subject, template, context } = sendMailData;

    const queueConnnection = this.configService.get('QUEUE_CONNECTION');
    switch (queueConnnection) {
      case 'sync': {
        return this.mailerService.sendMail({
          to,
          subject,
          template,
          context,
        });
      }
      case 'redis': {
        return this.mailQueue.add('send-email', {
          to,
          subject,
          template,
          context,
        });
      }
      default: {
        this.logger.error(`Invalid QUEUE_CONNECTION value ${queueConnnection}`);
        throw new InternalServerErrorException();
      }
    }
  }
}
