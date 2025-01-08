import { LoginRequestInput, SessionData } from '../types/users_schema';
import { clientWithoutToken as client } from '@/lib/axios-utils';

export const login = async (credentials: LoginRequestInput) => {
  const response = await client.post('/auth/login', credentials);

  const { access_token, refresh_token, user } = response.data;

  const userData = {
    accessToken: access_token,
    refreshToken: refresh_token,
    user,
  } as SessionData;

  return userData;
};
