import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { verifyHash } from 'src/utils/bcryptUtils';
import { generateRandomToken } from 'src/utils/cryptoUtils';
import { ConfirmEmailInput } from './inputs/confirm-email.input';
import { LoginInput } from './inputs/login.input';
import { RegisterInput } from './inputs/register.input';
import { ResendEmailVerificationInput } from './inputs/resend-email-verification.input';
import { ResetPasswordInput } from './inputs/reset-password.input';
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
      throw new BadRequestException('Invalid credentials.');
    }

    if (user.emailVerifiedAt == null) {
      throw new UnauthorizedException('Email Not Verified.');
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
      throw new BadRequestException('User with this email doesnot exist.');
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

  async confirmEmail(confirmEmailInput: ConfirmEmailInput): Promise<User> {
    const { token } = confirmEmailInput;
    const emailVerification =
      await this.emailVerificationRepository.findByToken(token);

    if (!emailVerification) {
      throw new BadRequestException('Token is either invalid or expired');
    }
    const result = this.userService.makeUserEmailVerified(
      emailVerification.email,
    );
    await this.emailVerificationRepository.deleteByToken(token);

    return result;
  }

  async resetPassword(resetPasswordInput: ResetPasswordInput): Promise<User> {
    const { token, newPassword } = resetPasswordInput;
    const forgotPassword = await this.forgotPasswordRepository.findByToken(
      token,
    );

    if (!forgotPassword) {
      throw new BadRequestException('Token is either invalid or expired');
    }
    const result = this.userService.resetPassword(
      forgotPassword.email,
      newPassword,
    );
    await this.forgotPasswordRepository.deleteByToken(token);
    return result;
  }

  async resendConfirmationEmail(
    resendVerificationEmailInput: ResendEmailVerificationInput,
  ) {
    const { email } = resendVerificationEmailInput;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User with this email doesnot exists.');
    }

    if (user.emailVerifiedAt) {
      throw new BadRequestException('User is already verified');
    }

    await this.sendConfirmationEmail(user);
    return user;
  }
}
