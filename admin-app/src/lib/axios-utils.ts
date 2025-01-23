// import { useAuthStore } from '@/store/auth_store';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Router from 'next/router';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// utility to create axios instance
const createAxiosInstance = (withToken: boolean): AxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
  });

  if (withToken) {
    instance.interceptors.request.use(
      (config) => {
        // const { accessToken } = useAuthStore.getState();

        // config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          Router.push('/login');
        }
        return Promise.reject(error);
      }
    );
  }

  return instance;
};

export default createAxiosInstance;
