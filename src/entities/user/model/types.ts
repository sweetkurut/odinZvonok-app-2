export type UserRole = 'client' | 'operator' | 'master';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  email?: string;
}