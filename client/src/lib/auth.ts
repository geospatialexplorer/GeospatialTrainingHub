import { User } from "@shared/schema";

export interface AuthUser {
  id: number;
  username: string;
  role: string;
}

export const authService = {
  async login(username: string, password: string): Promise<AuthUser> {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await response.json();
    return data.user;
  },

  async logout(): Promise<void> {
    const response = await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const response = await fetch("/api/admin/me", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        return data.user;
      }
      return null;
    } catch {
      return null;
    }
  },
};
