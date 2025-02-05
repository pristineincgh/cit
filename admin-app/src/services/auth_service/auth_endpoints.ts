import createAxiosInstance from "@/lib/axios-utils";
import {
  LoginRequestInput,
  ResetPasswordInput,
} from "@/lib/validations/auth_validations";
import { SessionSchema } from "@/types/auth_types";
import { UserUpdateInput } from "@/types/user_types";

const client = createAxiosInstance(false);
const authClient = createAxiosInstance(true);

export const LOGIN_USER = async (credentials: LoginRequestInput) => {
  const response = await client.post("/auth/login", credentials);

  const { access_token, refresh_token, user } = response.data;

  const userData = {
    accessToken: access_token,
    refreshToken: refresh_token,
    user,
  } as SessionSchema;

  return userData;
};

// * This is the endpoint for resetting a user's password
export const RESET_USER_PASSWORD = async (credentials: ResetPasswordInput) => {
  const response = await client.post("/auth/reset-password", {
    token: credentials.token,
    new_password: credentials.password,
  });

  return response.data;
};

// * This is the endpoint for resending a password reset email
export const RESEND_PASSWORD_RESET_EMAIL = async (token: string) => {
  const response = await client.post("/auth/resend-reset-password", { token });

  return response.data;
};

export const UPDATE_MY_PROFILE = async (user_data: UserUpdateInput) => {
  const response = await authClient.patch("/users/me", user_data);

  return response.data;
};
