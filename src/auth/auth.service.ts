import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  register(dto: RegisterDto): { id: number; name: string; email: string; role: string } {
    if (this.usersService.findByEmail(dto.email)) {
      throw new ConflictException('An account with this email already exists');
    }
    const passwordHash = bcrypt.hashSync(dto.password, 10);
    return this.usersService.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: 'user',
    });
  }

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const user = this.usersService.findByEmail(dto.email);
    const passwordIsValid = user
      ? await bcrypt.compare(dto.password, user.passwordHash)
      : false;

    // Use one generic error so callers cannot discover whether an email is registered.
    if (!user || !passwordIsValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async changePassword(userId: number, dto: ChangePasswordDto): Promise<{ message: string }> {
    const user = this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    const currentPasswordIsValid = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );
    if (!currentPasswordIsValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException('New password must be different from current password');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);
    this.usersService.updatePassword(userId, passwordHash);
    return { message: 'Password updated' };
  }
}
