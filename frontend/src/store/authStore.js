import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({
        authUser: res.data,
        isCheckingAuth: false, // Auth check complete
      });
    } catch (error) {
      console.error("Authentication check failed:", error);
      set({
        authUser: null,
        isCheckingAuth: false, // Ensure loading state ends even on error
      });
    }
  },
  signup: async (data) =>{
    
  }
}));
