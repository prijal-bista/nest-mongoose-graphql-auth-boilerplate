import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  EmailVerification,
  EmailVerificationDocument,
} from '../schemas/email-verification-schema';

@Injectable()
export class EmailVerificationRepository {
  constructor(
    @InjectModel(EmailVerification.name)
    private emailVerificationModel: Model<EmailVerificationDocument>,
  ) {}

  create(email: string, token: string) {
    const timestamp = new Date();
    const data: EmailVerification = {
      email,
      token,
      timestamp,
    };
    const emailVerification = new this.emailVerificationModel(data);
    return emailVerification.save();
  }
}
