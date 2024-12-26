import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { login } from './endpoints';
import { createServerSession } from '../_actions/auth-actions';
import { useAuthStore } from '@/store/auth';

export const useLoginUser = () => {
  const router = useRouter();
  const { setSession } = useAuthStore();

  return useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      toast.success('Login successful');

      // set session data to store
      setSession(data);

      // create server session
      await createServerSession(data);

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
