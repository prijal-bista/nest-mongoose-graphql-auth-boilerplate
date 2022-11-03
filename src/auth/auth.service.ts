import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { verifyHash } from 'src/utils/bcryptUtils';
import { LoginInput } from './inputs/login.input';
import { RegisterInput } from './inputs/register.input';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  register(registerInput: RegisterInput): Promise<User> {
    return this.userService.createUser(registerInput);
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
}
