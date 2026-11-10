import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'lab09-development-secret-change-before-deployment',
    });
  }

  async validate(payload: { sub: number }): Promise<{ sub: number; email: string; role: string }> {
    const user = this.usersService.findById(Number(payload.sub));
    if (!user) throw new UnauthorizedException('Invalid authentication token');
    return { sub: user.id, email: user.email, role: user.role };
  }
}
