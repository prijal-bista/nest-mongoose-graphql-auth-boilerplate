import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { verifyHash } from 'src/utils/bcryptUtils';
import { ChangePasswordInput } from './inputs/change-password.input';
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

  async changePassword(user: User, changePasswordInput: ChangePasswordInput) {
    const { currentPassword, newPassword } = changePasswordInput;

    if (!(await verifyHash(currentPassword, user.password))) {
      throw new UnprocessableEntityException('Password is invalid.');
    }

    return this.userRepository.updatePassword(user, newPassword);
  }

  makeUserEmailVerified(email: string): Promise<User> {
    return this.userRepository.makeUserEmailVerified(email);
  }
}
