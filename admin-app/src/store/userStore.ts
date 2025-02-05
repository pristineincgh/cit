import { User } from "@/types/user_types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserStore {
  users: User[];
  total_users: number;
  setUsers: (users: User[]) => void;
  setTotalUsers: (total_users: number) => void;
  addUser: (user: User) => void;
  deleteUser: (id: string) => void;
  updateUser: (user: User) => void;
  getUser: (id: string) => User | null;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: [],
      total_users: 0,
      setUsers: (users: User[]) => set({ users: users }),
      setTotalUsers: (total_users: number) => set({ total_users: total_users }),
      addUser: (user: User) =>
        set((state) => ({ users: [...state.users, user] })),
      deleteUser: (id: string) =>
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        })),
      updateUser: (user: User) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === user.id ? user : u)),
        })),
      getUser: (id: string) =>
        get().users.find((user) => user.id === id) || null,
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
