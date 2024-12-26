import axios from 'axios';
import { useRouter } from 'next/router';

const clientWithoutToken = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

const clientWithToken = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

clientWithToken.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

clientWithToken.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        return clientWithToken(originalRequest);
      } else {
        const router = useRouter();
        router.push('/login');
      }
    }
    return Promise.reject(error);
  }
);

async function refreshAccessToken() {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axios.get(
      `${process.env.API_BASE_URL}/auth/refresh-token`
    );
    axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`;
    const { access_token } = response.data;
    localStorage.setItem('accessToken', access_token);
    return access_token;
  } catch {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return null;
  }
}

export { clientWithoutToken, clientWithToken };
