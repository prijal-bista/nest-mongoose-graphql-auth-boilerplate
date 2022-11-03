import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  createUser(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    return this.userRepository.createUser(userData);
  }

  findByEmail(email: string): Promise<User> {
    return this.userRepository.findByEmail(email);
  }
}
