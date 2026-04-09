import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me");
        setUser(data);
      } catch {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.access_token);
    setUser(data.user);
    toast.success("Logged in successfully");
    return data.user;
  };

  const register = async (payload) => {
    await api.post("/auth/register", payload);
    toast.success("Registration successful. Please login.");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out");
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, isAuthenticated: !!user }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
