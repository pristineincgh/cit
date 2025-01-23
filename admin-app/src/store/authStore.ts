import { SessionSchema } from '@/types/auth_types';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthStore {
  session: SessionSchema | null;
  setSession: (session: SessionSchema | null) => Promise<void>;
  updateAccessToken: (accessToken: string) => Promise<void>;
  clearSession: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      session: null,
      setSession: async (session) => {
        try {
          set({ session });
        } catch (error) {
          console.log('Error setting session:', error);
        }
      },
      updateAccessToken: async (accessToken: string) => {
        try {
          // update session data
          set((state) => ({
            session: state.session ? { ...state.session, accessToken } : null,
          }));
        } catch (error) {
          console.error('Failed to update access token', error);
        }
      },
      clearSession: async () => {
        // try {
        //   // call server action to delete session
        //   const response = await logout();
        //   // clear session data from store
        //   if (response.success) {
        //     set({ session: null });
        //   } else {
        //     throw new Error('Failed to logout');
        //   }
        // } catch (error) {
        //   console.error('Failed to delete session', error);
        // }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
