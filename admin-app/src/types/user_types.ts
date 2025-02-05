import { Role } from "./auth_types";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role: Role;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCreateInput {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  role: Role;
}

export interface UserUpdateInput {
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: Role;
}

export interface UserListResponse {
  total: number;
  users: User[];
}
