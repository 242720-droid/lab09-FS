import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User, UserRole, SafeUser } from './user.model';

@Injectable()
export class UsersService {
  private nextId = 3;
  private readonly users: User[] = [
    {
      id: 1,
      name: 'Lab Admin',
      email: 'admin@example.com',
      role: 'admin',
      passwordHash: bcrypt.hashSync('Admin1234', 10),
    },
    {
      id: 2,
      name: 'Lab User',
      email: 'user@example.com',
      role: 'user',
      passwordHash: bcrypt.hashSync('User1234', 10),
    },
  ];

  findByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  }

  findById(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  create(input: {
    name: string;
    email: string;
    passwordHash: string;
    role?: UserRole;
  }): SafeUser {
    const user: User = {
      id: this.nextId++,
      name: input.name,
      email: input.email.toLowerCase(),
      role: input.role ?? 'user',
      passwordHash: input.passwordHash,
    };
    this.users.push(user);
    return this.toSafeUser(user);
  }

  updatePassword(userId: number, passwordHash: string): void {
    const user = this.findById(userId);
    if (!user) throw new Error('User not found while updating password');
    user.passwordHash = passwordHash;
  }

  findAllSafe(): SafeUser[] {
    return this.users.map((user) => this.toSafeUser(user));
  }

  private toSafeUser(user: User): SafeUser {
    const { passwordHash: _passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
