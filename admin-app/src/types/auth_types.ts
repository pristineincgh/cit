// create enum for role
export enum Role {
  AGENT = 'agent',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
}

export interface LoginResponse {
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

export interface SessionSchema {
  accessToken: string;
  refreshToken: string;
  user: LoginResponse;
}
