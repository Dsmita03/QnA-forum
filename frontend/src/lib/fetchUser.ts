// utils/fetchAndStoreUser.ts

import axios from "axios";
import { useAppStore } from "@/store";

export const fetchAndStoreUser = async () => {
  try {
    const res = await axios.get("/api/auth/profile"); // Adjust path if needed
    const user = res.data;

    useAppStore.getState().setUser({
      name: user.name,
      email: user.email,
      userId: user.id,
      role: user.role,
      isLoggedIn: true,
      profileImage: user.profileImage || "/profile.png",
    });
  } catch (err) {
    console.error("Error fetching user profile", err);
  }
};
