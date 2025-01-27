import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { LOGIN_USER } from './auth_endpoints';
import { createSession } from '@/actions/auth-actions';
import { useAuthStore } from '@/store/authStore';

export const useLoginUser = () => {
  const router = useRouter();
  const { setSession } = useAuthStore();

  return useMutation({
    mutationFn: LOGIN_USER,
    onSuccess: async (data) => {
      try {
        await createSession(data);
        setSession(data);
        router.push('/dashboard');
        toast.success('Login successful');
      } catch (error) {
        toast.error('Failed to login');
        console.log('Error creating session:', error);
      }
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.detail);
      } else {
        toast.error(`An error occurred: ${error.message}`);
      }
    },
  });
};
