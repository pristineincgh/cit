import { SessionSchema } from '@/app/(auth)/types/schema';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { logout } from '@/app/(auth)/_actions/auth-actions';

// store interface
interface AuthStore {
  session: SessionSchema | null;
  setSession: (session: SessionSchema) => Promise<void>;
  clearSession: () => void;
}

// store
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      session: null,
      setSession: async (session) => {
        try {
          // set session data to store
          set({ session });
        } catch (error) {
          console.error('Failed to create session', error);
        }
      },
      clearSession: async () => {
        try {
          // call server action to delete session
          const response = await logout();

          // clear session data from store
          if (response.success) {
            set({ session: null });
          } else {
            throw new Error('Failed to logout');
          }
        } catch (error) {
          console.error('Failed to delete session', error);
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
