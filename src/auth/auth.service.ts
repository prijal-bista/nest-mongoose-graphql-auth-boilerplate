import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { verifyHash } from 'src/utils/bcryptUtils';
import { generateRandomToken } from 'src/utils/cryptoUtils';
import { LoginInput } from './inputs/login.input';
import { RegisterInput } from './inputs/register.input';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(registerInput: RegisterInput): Promise<User> {
    const user = await this.userService.createUser(registerInput);
    const token = generateRandomToken(64);
    await this.mailService.sendUserConfirmationEmail(user, token);
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
    const token = generateRandomToken(64);
    await this.mailService.sendForgotPasswordEmail(user, token);
    return user;
  }
}
