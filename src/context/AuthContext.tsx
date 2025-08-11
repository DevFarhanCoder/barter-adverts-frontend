// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
// Update the import path below to the correct relative path to your types file
import { AuthUser, UserRole } from "../types";

type AuthCtx = {
  user: AuthUser | null;
  login: (u: AuthUser) => void;
  logout: () => void;
};
const Ctx = createContext<AuthCtx>({ user: null, login: () => {}, logout: () => {} });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("ba_user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const login = (u: AuthUser) => {
    setUser(u);
    localStorage.setItem("ba_user", JSON.stringify(u));
    localStorage.setItem("token", u.token);
    localStorage.setItem("role", u.role as UserRole);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ba_user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
};

export const useAuth = () => useContext(Ctx);
