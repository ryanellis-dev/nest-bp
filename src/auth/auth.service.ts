import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClsService } from 'nestjs-cls';
import { AuthPayload } from 'src/common/types/auth.types';
import { TypedClsStore } from 'src/common/types/cls.types';
import { LoggedInUser } from 'src/users/model/user.model';
import { UsersRepo } from 'src/users/users.repo';
import { LoginDto } from './dto/login.dto';
import { Login } from './model/Login.model';

@Injectable()
export class AuthService {
  constructor(
    private usersRepo: UsersRepo,
    private jwtService: JwtService,
    private cls: ClsService<TypedClsStore>,
  ) {}

  async login(data: LoginDto): Promise<{ access_token: string }> {
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
    const user = this.cls.get('user');
    if (!user?.sub) throw new UnauthorizedException();
    const repoUser = await this.usersRepo.getUser({ where: { id: user.sub } });
    if (!repoUser) throw new UnauthorizedException();
    return new LoggedInUser(repoUser);
  }
}
