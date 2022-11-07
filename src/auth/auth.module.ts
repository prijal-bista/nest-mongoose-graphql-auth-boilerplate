import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { EmailVerificationRepository } from './repositories/email-verificatoin.repository';
import { ForgotPasswordRepository } from './repositories/forgot-password.respository';
import {
  EmailVerification,
  EmailVerificationSchema,
} from './schemas/email-verification-schema';
import {
  ForgotPassword,
  ForgotPasswordSchema,
} from './schemas/forgot-password.schema';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRY_SECONDS'),
          },
        };
      },
    }),
    UserModule,
    MongooseModule.forFeature([
      { name: EmailVerification.name, schema: EmailVerificationSchema },
      { name: ForgotPassword.name, schema: ForgotPasswordSchema },
    ]),
  ],
  providers: [
    AuthResolver,
    AuthService,
    JwtStrategy,
    ForgotPasswordRepository,
    EmailVerificationRepository,
  ],
})
export class AuthModule {}
