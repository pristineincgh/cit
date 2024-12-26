import { clientWithoutToken as client } from '@/lib/axios-utils';
import { LoginInputSchema } from '../types/schema';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

const login = async (credentials: LoginInputSchema) => {
  const response = await client.post('/auth/login', credentials);
  return response.data;
};

export const useLoginUser = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: login,
    onSuccess(data) {
      localStorage.setItem('accessToken', data.access_token);
      localStorage.setItem('refreshToken', data.refresh_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      const user = data.user;

      if (user.role === 'admin') {
        router.push('/admin');
        return;
      } else if (user.role === 'user') {
        router.push('/agent');
        return;
      }
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(`An error occurred: ${error.message}`);
      }
    },
  });
};
