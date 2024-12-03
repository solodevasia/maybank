import UserEntity from '@maybank/entities/user/user.entity';
import { CustomRequest } from '@maybank/types/request';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import fs from 'fs';
import { join } from 'path';

@Injectable()
export default class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as CustomRequest;
    const token = request.headers.authorization?.split('Bearer ')?.[1];

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: fs.readFileSync(join(__dirname, '../../jwtRS256.key'), {
          encoding: 'utf-8',
        }),
      });
      request['user'] = payload as unknown as UserEntity;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}

