import { SessionData } from '@/app/(auth)/types/users_schema';
import axios from 'axios';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const patterns = {
  password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
};

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

// Type definition for session storage data
interface SessionStorageData {
  state: {
    session: SessionData | null;
  };
}

// function to get tokens from session storage
export const getTokens = (): Tokens | null => {
  if (typeof window === 'undefined') {
    console.warn('sessionStorage is not available in SSR. Returning null.');
    return null;
  }

  const storedData = sessionStorage.getItem('auth-storage');

  if (!storedData) {
    return null;
  }

  try {
    const parsedData: SessionStorageData = JSON.parse(storedData);
    const session = parsedData?.state?.session;

    if (!session || !session.accessToken || !session.refreshToken) {
      console.warn('Tokens not found in session data');
      return null;
    }

    // Return the tokens
    return {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    };
  } catch (error) {
    console.error('Error parsing sessionStorage data:', error);
    return null;
  }
};

// Function to refresh the access token
export const refreshAccessToken = async (BASE_URL: string): Promise<string> => {
  const tokens = getTokens();
  if (!tokens)
    throw new Error('No refresh token available for access token refresh.');

  try {
    const response = await axios.post(`${BASE_URL}/auth/refresh`, {
      refresh_token: tokens?.refreshToken,
    });

    const { access_token: newAccessToken, refresh_token: newRefreshToken } =
      response.data;

    const storedData = sessionStorage.getItem('auth-storage');

    if (storedData) {
      const parsedData: SessionStorageData = JSON.parse(storedData);
      const state = parsedData.state;

      if (state?.session) {
        state.session.accessToken = newAccessToken;
        state.session.refreshToken = newRefreshToken;

        sessionStorage.setItem(
          'auth-storage',
          JSON.stringify({
            ...parsedData,
            state,
          })
        );
      } else {
        console.warn('Session data not found in sessionStorage.');
      }
    }

    return newAccessToken;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    throw error;
  }
};
