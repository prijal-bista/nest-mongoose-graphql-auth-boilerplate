import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bull';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
    @InjectQueue('mail')
    private mailQueue: Queue,
  ) {}

  async sendUserConfirmationEmailSync(user: User, token: string) {
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
    console.log(result);
    return true;
  }

  async sendForgotPasswordEmailSync(user: User, token: string) {
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
    console.log(result);
    return true;
  }

  async sendUserConfirmationEmail(user: User, token: string) {
    const queueConnnection = this.configService.get('QUEUE_CONNECTION');
    switch (queueConnnection) {
      case 'sync': {
        return this.sendUserConfirmationEmailSync(user, token);
      }

      case 'redis': {
        const result = await this.mailQueue.add('confirmation', {
          user,
          token,
        });
        console.log(result);
        break;
      }
      default: {
        console.log('invalid QUEUE_CONNECTION value ' + queueConnnection);
        throw new InternalServerErrorException();
      }
    }
    return true;
  }

  async sendForgotPasswordEmail(user: User, token: string) {
    const queueConnnection = this.configService.get('QUEUE_CONNECTION');
    switch (queueConnnection) {
      case 'sync': {
        return this.sendForgotPasswordEmailSync(user, token);
      }
      case 'redis': {
        const result = await this.mailQueue.add('forgotPassword', {
          user,
          token,
        });
        // console.log(result);
        break;
      }
      default: {
        console.log('invalid QUEUE_CONNECTION value ' + queueConnnection);
        throw new InternalServerErrorException();
      }
    }
  }
}
