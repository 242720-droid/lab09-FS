export type UserRole = 'user' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  passwordHash: string;
}

export type SafeUser = Omit<User, 'passwordHash'>;
