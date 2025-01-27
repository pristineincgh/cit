'use server';

import { SessionSchema } from '@/types/auth_types';
import { cookies } from 'next/headers';

export const createSession = async (session: SessionSchema) => {
  const cookieStore = await cookies();

  const cookieOptions = {
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: true, // Ensure secure attribute
  };

  cookieStore.set('user', JSON.stringify(session.user), cookieOptions);
  cookieStore.set('accessToken', session.accessToken, cookieOptions);
  cookieStore.set('refreshToken', session.refreshToken, cookieOptions);

  return {
    success: true,
  };
};

// server action to delete user session
export const logout = async () => {
  try {
    const cookieStore = await cookies();

    // clear session cookies
    cookieStore.delete('user');
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');

    return { success: true };
  } catch (error) {
    console.error('Failed to logout', error);
    return { success: false };
  }
};

// helper function to get current user from cookies
export const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user');

  if (!userCookie) {
    return null;
  }

  try {
    const user = JSON.parse(userCookie.value) as SessionSchema['user'];

    return user;
  } catch (error) {
    console.error('Failed to parse user cookie', error);
    return null;
  }
};
