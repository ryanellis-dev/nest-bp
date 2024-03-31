import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload } from 'src/common/types/auth.types';
import { getUserOrThrow } from 'src/common/utils/get-user';
import { LoggedInUser } from 'src/users/model/user.model';
import { UsersRepo } from 'src/users/users.repo';
import { LoginDto } from './dto/login.dto';
import { Login } from './model/Login.model';

@Injectable()
export class AuthService {
  constructor(
    private usersRepo: UsersRepo,
    private jwtService: JwtService,
  ) {}

  async login(data: LoginDto): Promise<Login> {
    const user = await this.usersRepo.getUser({ where: { email: data.email } });
    if (!user) throw new UnauthorizedException();
    const payload: AuthPayload = {
      sub: user.id,
      email: user.email,
    };
    return new Login({
      access_token: await this.jwtService.signAsync(payload),
    });
  }

  async getLoggedInUser(): Promise<LoggedInUser> {
    const user = getUserOrThrow();
    return new LoggedInUser(user);
  }
}
