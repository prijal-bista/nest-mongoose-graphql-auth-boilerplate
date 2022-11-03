import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    try {
      return await this.userRepository.createUser(userData);
    } catch (err) {
      if (err.code === 11000) {
        // email already exists
        throw new ConflictException(
          `User with email ${userData.email} already exists`,
        );
      }
    }
  }

  findByEmail(email: string): Promise<User> {
    return this.userRepository.findByEmail(email);
  }
}
