import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
    name: string;
    userId?: string;
    email?: string;
    role?: "user" | "admin";
    isLoggedIn: boolean;
    profileImage: string;
}

interface AppState {
    user: User;
    setUser: (newUser: Partial<User> & { name: string }) => void;
    updateUser: (updates: Partial<User>) => void;
    clearUser: () => void;
    isAuthenticated: () => boolean;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            user: {
                name: "",
                userId: undefined,
                email: undefined,
                role: undefined,
                isLoggedIn: false,
                profileImage: "/profile.png", 
            },
            setUser: (newUser) =>
                set({
                    user: {
                        ...get().user, // Preserve existing user data
                        ...newUser, // Override with new data
                        profileImage: newUser.profileImage || get().user.profileImage || "/profile.png",
                        isLoggedIn: newUser.isLoggedIn ?? true,
                    },
                }),
            updateUser: (updates) =>
                set({
                    user: {
                        ...get().user,
                        ...updates,
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
                        profileImage: "/profile.png",
                    },
                })),
            isAuthenticated: () => get().user.isLoggedIn,
        }),
        { name: "userStore" }
    )
);
