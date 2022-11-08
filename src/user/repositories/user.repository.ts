import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash } from 'src/common/utils/bcryptUtils';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    // hash password
    userData.password = await hash(userData.password);

    const data = new this.userModel(userData);
    return data.save();
  }

  findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async updatePassword(userData: User, newPassword: string) {
    const user = await this.userModel.findOne({ email: userData.email }).exec();
    user.password = await hash(newPassword);
    await user.save();
    return user;
  }

  async makeUserEmailVerified(email: string): Promise<User> {
    const user = await this.findByEmail(email);
    user.emailVerifiedAt = new Date();
    await user.save();
    return user;
  }
}
