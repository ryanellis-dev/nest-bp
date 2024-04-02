import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ClsService } from 'nestjs-cls';
import appConfig from 'src/config/app.config';
import { prismaOrgRoleToModel } from 'src/permission/dto/org-role.dto';
import { LoggedInUser } from 'src/users/model/user.model';
import { UsersRepo } from 'src/users/users.repo';
import { BYPASS_AUTH_KEY } from '../decorators/bypass-auth.decorator';
import { AuthPayload } from '../types/auth.types';
import { TypedClsStore } from '../types/cls.types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private usersRepo: UsersRepo,
    private jwtService: JwtService,
    private cls: ClsService<TypedClsStore>,
    private reflector: Reflector,
    @Inject(appConfig.KEY) private appConf: ConfigType<typeof appConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (
      this.reflector.getAllAndOverride<boolean>(BYPASS_AUTH_KEY, [
        context.getHandler(),
        context.getClass(),
      ])
    ) {
      this.cls.set('user', null);
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();
    try {
      const payload = await this.jwtService.verifyAsync<AuthPayload>(token, {
        secret: this.appConf.jwtSecret,
      });

      const user = await this.usersRepo.getLoggedInUser({
        userId: payload.sub,
        orgId: payload.orgId,
      });
      if (!user) throw new UnauthorizedException();
      const org = user.organisations[0];
      this.cls.set(
        'user',
        new LoggedInUser({
          ...user,
          orgId: org.orgId,
          orgRole: prismaOrgRoleToModel(org.role),
        }),
      );
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
