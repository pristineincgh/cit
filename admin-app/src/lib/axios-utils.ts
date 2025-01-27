import { useAuthStore } from '@/store/authStore';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Router from 'next/router';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// get new access token
const refreshAccessToken = async () => {
  const { session } = useAuthStore.getState();

  if (!session) {
    throw new Error('No session found');
  }

  try {
    const response = await axios.post(`${BASE_URL}/auth/refresh`, {
      refresh_token: session.refreshToken,
    });

    const { access_token: newAccessToken, refresh_token: newRefreshToken } =
      response.data;

    useAuthStore.getState().updateTokens({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });

    return newAccessToken;
  } catch (error) {
    console.error('Failed to get new access token', error);
    throw new Error('Failed to get new access token');
  }
};

// utility to create axios instance
const createAxiosInstance = (withToken: boolean): AxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
  });

  if (withToken) {
    instance.interceptors.request.use(
      (config) => {
        const { session } = useAuthStore.getState();

        config.headers.Authorization = `Bearer ${session?.accessToken}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config;

        console.log('error', error.response);

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await refreshAccessToken();
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return instance(originalRequest);
          } catch (tokenError) {
            Router.push('/login');
            return Promise.reject(tokenError);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  return instance;
};

export default createAxiosInstance;
