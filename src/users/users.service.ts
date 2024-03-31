import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ManyUsers, User } from './model/user.model';
import { UsersRepo } from './users.repo';

@Injectable()
export class UsersService {
  constructor(private usersRepo: UsersRepo) {}

  async createUser(data: CreateUserDto): Promise<User> {
    return new User(await this.usersRepo.createUser({ data }));
  }

  async deleteUser(userId: string): Promise<void> {
    await this.usersRepo.deleteUser({ where: { id: userId } });
  }

  async getUsers(): Promise<ManyUsers> {
    const users = await this.usersRepo.getUsers({});
    return { results: users.map((u) => new User(u)) };
  }
}
