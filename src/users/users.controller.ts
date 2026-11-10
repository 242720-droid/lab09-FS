import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { SafeUser } from './user.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  findAll(): SafeUser[] {
    // Explicit mapping ensures passwordHash is never exposed in the API response.
    return this.usersService.findAllSafe().map(({ id, name, email, role }) => ({
      id,
      name,
      email,
      role,
    }));
  }
}
