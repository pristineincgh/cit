import { User } from "./user_types";

// create enum for role
export enum Role {
  AGENT = "agent",
  ADMIN = "admin",
  SUPERADMIN = "superadmin",
}

export interface SessionSchema {
  accessToken: string;
  refreshToken: string;
  user: User;
}
