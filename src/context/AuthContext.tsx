import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type User = {
  _id?: string;
  name?: string;
  email?: string;
  userType?: 'advertiser' | 'media_owner';
  // add other fields you store in ba_user
} | null;

type AuthContextValue = {
  user: User;
  setUser: (u: User) => void;
  token: string | null;
  setToken: (t: string | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  setUser: () => {},
  token: null,
  setToken: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, _setUser] = useState<User>(null);
  const [token, _setToken] = useState<string | null>(null);

  // Load once from localStorage (use the SAME keys your signup/login uses)
  useEffect(() => {
    try {
      const u = localStorage.getItem('ba_user');
      const t = localStorage.getItem('token');
      if (u) _setUser(JSON.parse(u));
      if (t) _setToken(t);
    } catch {}
  }, []);

  const setUser = (u: User) => {
    _setUser(u);
    if (u) localStorage.setItem('ba_user', JSON.stringify(u));
    else localStorage.removeItem('ba_user');
    // keep backwards compat role mirror if your app reads it elsewhere
    if (u && (u as any).userType) localStorage.setItem('role', (u as any).userType);
    else localStorage.removeItem('role');
    window.dispatchEvent(new Event('auth:changed'));
  };

  const setToken = (t: string | null) => {
    _setToken(t);
    if (t) localStorage.setItem('token', t);
    else localStorage.removeItem('token');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = useMemo(() => ({ user, setUser, token, setToken, logout }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
