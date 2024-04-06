import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginatedUsers, User } from './model/user.model';
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

  async getUsers({
    limit,
    offset,
  }: PaginationQueryDto): Promise<PaginatedUsers> {
    const resp = await this.usersRepo.getUsers({ take: limit, skip: offset });
    return {
      results: resp.users.map((u) => new User(u)),
      limit,
      offset,
      total: resp.total,
    };
  }
}
