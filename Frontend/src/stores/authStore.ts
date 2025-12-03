// src/stores/authStore.ts
import { defineStore } from "pinia";
import axiosInstance from "@/config/axiosInstance";

interface Staff {
  staffId: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  staff: Staff | null;
  loading: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    isAuthenticated: false,
    staff: null,
    loading: false,
  }),

  persist: true, // <- saves to localStorage

  actions: {
    // Login staff (your backend sets the cookie)
    async login(staffId: string, password: string) {
      try {
        this.loading = true;

        const response = await axiosInstance.post("/api/staff/login", {
          staffId,
          password,
        });

        // The server should return staff info
        this.isAuthenticated = true;
        this.staff = response.data.staff; // { staffId, role }

        return response.data.message;
      } catch (error: any) {
        throw error.response?.data?.error || "Login attempt failed";
      } finally {
        this.loading = false;
      }
    },

    // Logout (clear cookie + store)
    async logout() {
      await axiosInstance.post("/api/staff/logout");

      this.isAuthenticated = false;
      this.staff = null;
    },

    // Check if the session cookie is still valid
    async checkAuth() {
      try {
        const response = await axiosInstance.get("/api/staff/check-auth");

        this.isAuthenticated = true;
        this.staff = response.data.staff; // staffId + role
      } catch {
        this.isAuthenticated = false;
        this.staff = null;
      }
    },
  },
});
