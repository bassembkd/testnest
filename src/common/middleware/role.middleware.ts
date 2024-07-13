import { Injectable, NestMiddleware, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';

@Injectable()
export class RoleMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not found');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }


    let decodedToken;
    try {
      decodedToken = this.jwtService.verify(token);
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }

    const userId = decodedToken.userId;
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not founxd');
    }

    if (!user.roles.includes('admin')) {
      throw new ForbiddenException('Forbidden role');
    }

    next();
  }
}
