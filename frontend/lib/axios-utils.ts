import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Router from 'next/router';
import { getTokens, refreshAccessToken } from './utils';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// utility to create axios instance
const createAxiosClient = (withToken: boolean): AxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
  });

  if (withToken) {
    instance.interceptors.request.use(
      (config) => {
        const tokens = getTokens();
        if (tokens?.accessToken) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }

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
            const newToken = await refreshAccessToken(BASE_URL);
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

export const clientWithoutToken = createAxiosClient(false);
export const clientWithToken = createAxiosClient(true);
