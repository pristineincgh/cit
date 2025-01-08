'use server';

import { cookies } from 'next/headers';
import {
  SessionData,
  sessionSchema,
  loginResponseSchema,
} from '../types/users_schema';

// server action to create user session
export const createServerSession = async (session: SessionData) => {
  try {
    // validate session data
    const validatedSession = sessionSchema.safeParse(session);

    if (!validatedSession.success) {
      throw new Error('Invalid session data');
    }

    const cookieStore = await cookies();

    // set session cookies
    cookieStore.set('user', JSON.stringify(session.user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60,
    });

    cookieStore.set('accessToken', session.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60,
    });

    cookieStore.set('refreshToken', session.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 3,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to create session', error);
    return { success: false };
  }
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
    const user = JSON.parse(userCookie.value);

    return loginResponseSchema.safeParse(user).data;
  } catch (error) {
    console.error('Failed to parse user cookie', error);
    return null;
  }
};
