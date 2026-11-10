import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtStrategy } from '../auth/jwt.strategy';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'lab09-development-secret-change-before-deployment',
      signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as any },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy, AuthGuard, RolesGuard],
  exports: [UsersService, JwtModule, AuthGuard, RolesGuard],
})
export class UsersModule {}
