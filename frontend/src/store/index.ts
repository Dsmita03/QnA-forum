import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  name: string;
  userId?: string;
  email?: string;
  role?: string;
  isLoggedIn?: boolean;
}

interface AppState {
  user: User;
  setUser: (newUser: User) => void;
 clearUser: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            user: {
                 name: "",
                 userId: undefined, 
                 email: undefined, 
                 role: undefined, 
                 isLoggedIn: false 
                },
            setUser: (newUser) =>
                set({
                    user: {
                         name: newUser.name ?? "",
                         userId: newUser.userId,
                         email: newUser.email,
                         role: newUser.role,
                         isLoggedIn: newUser.isLoggedIn ?? true,
                    },
                }),
                clearUser: () =>
                        set(() => ({
                           user: {
                               name: "",
                               userId: undefined,
                               email: undefined,
                               role: undefined,
                               isLoggedIn: false,
                           },
                       })),
        }),
        { name: "userStore" }
    )
);
