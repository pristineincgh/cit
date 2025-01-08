import { SessionData } from '@/app/(auth)/types/users_schema';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { logout } from '@/app/(auth)/_actions/auth-actions';

// store interface
interface AuthStore {
  session: SessionData | null;
  setSession: (session: SessionData) => Promise<void>;
  updateAccessToken: (accessToken: string) => Promise<void>;
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
