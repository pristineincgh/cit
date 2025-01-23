import createAxiosInstance from '@/lib/axios-utils';
import { LoginRequestInput } from '@/lib/validations/auth_validations';
import { SessionSchema } from '@/types/auth_types';

const client = createAxiosInstance(false);

export const LOGIN_USER = async (credentials: LoginRequestInput) => {
  const response = await client.post('/auth/login', credentials);

  const { access_token, refresh_token, user } = response.data;

  const userData = {
    accessToken: access_token,
    refreshToken: refresh_token,
    user,
  } as SessionSchema;

  return userData;
};
