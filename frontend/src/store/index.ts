import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  userId?: string;
  role?: string;
  isLoggedIn?: boolean;
}

interface AppState {
  user: User;
  setUser: (newUser: User) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            user: { userId: undefined, role: undefined, isLoggedIn: undefined},
            setUser: (newUser) =>
                set({
                    user: {
                        userId: newUser.userId,
                        role: newUser.role,
                        isLoggedIn:newUser.isLoggedIn
                    },
                }),
        }),
        { name: "userStore" }
    )
);
