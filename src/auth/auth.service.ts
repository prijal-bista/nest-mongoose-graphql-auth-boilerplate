import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { verifyHash } from 'src/utils/bcryptUtils';
import { generateRandomToken } from 'src/utils/cryptoUtils';
import { LoginInput } from './inputs/login.input';
import { RegisterInput } from './inputs/register.input';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { EmailVerificationRepository } from './repositories/email-verificatoin.repository';
import { ForgotPasswordRepository } from './repositories/forgot-password.respository';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
    private emailVerificationRepository: EmailVerificationRepository,
    private forgotPasswordRepository: ForgotPasswordRepository,
  ) {}

  async sendConfirmationEmail(user: User) {
    const token = generateRandomToken(32);
    await this.emailVerificationRepository.create(user.email, token);
    const url = `${this.configService.get('FRONTEND_URL')}/${token}/verify`;

    await this.mailService.sendMail({
      to: user.email,
      subject: `${this.configService.get(
        'APP_NAME',
      )} | Please Confirm Your Email`,
      template: './forgot-password',
      context: { name: user.name, url },
    });
  }

  async register(registerInput: RegisterInput): Promise<User> {
    const user = await this.userService.createUser(registerInput);
    await this.sendConfirmationEmail(user); // send confirm email verification
    return user;
  }

  async login(
    loginInput: LoginInput,
  ): Promise<{ user: User; accessToken: string }> {
    const { email, password } = loginInput;
    const user = await this.userService.findByEmail(email);

    if (!user || !(await verifyHash(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // generate accessToken with jwt
    const payload: JwtPayload = { email };
    const accessToken = await this.jwtService.sign(payload);

    return {
      user,
      accessToken,
    };
  }

  async sendForgotPasswordEmail(email: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnprocessableEntityException('Email doesnot exist.');
    }

    const token = generateRandomToken(32);
    await this.forgotPasswordRepository.create(user.email, token);
    const url = `${this.configService.get('FRONTEND_URL')}/${token}/reset`;

    await this.mailService.sendMail({
      to: user.email,
      subject: `${this.configService.get('APP_NAME')} | Reset Password`,
      template: './forgot-password',
      context: { name: user.name, url },
    });

    return user;
  }
}
