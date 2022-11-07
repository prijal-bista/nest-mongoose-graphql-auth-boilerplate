import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ForgotPassword,
  ForgotPasswordDocument,
} from '../schemas/forgot-password.schema';

@Injectable()
export class ForgotPasswordRepository {
  constructor(
    @InjectModel(ForgotPassword.name)
    private forgotPasswordModel: Model<ForgotPasswordDocument>,
  ) {}

  create(email: string, token: string) {
    const timestamp = new Date();
    const data: ForgotPassword = {
      email,
      token,
      timestamp,
    };
    const forgotPassword = new this.forgotPasswordModel(data);
    return forgotPassword.save();
  }

  findByToken(token: string): Promise<ForgotPasswordDocument> {
    return this.forgotPasswordModel
      .findOne({
        token,
        timestamp: {
          $gt: new Date(new Date().getTime() - 1000 * 60 * 10),
        },
      })
      .exec();
  }

  async deleteByToken(token: string): Promise<void> {
    const result = await this.forgotPasswordModel.deleteOne({ token });
    console.log(result);
  }
}
