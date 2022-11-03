import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash } from 'src/utils/bcryptUtils';
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

  findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }
}
