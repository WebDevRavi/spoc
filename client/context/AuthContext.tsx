import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Role, User } from "@/data/mock";
import { findUserByCredentials, registerUser } from "@/data/mock";

interface AuthState {
  user: User | null;
  login: (username: string, email: string) => Promise<User | null>;
  register: (
    username: string,
    email: string,
    role: Role,
    departmentId?: string,
  ) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);
const AUTH_KEY = "spoc_current_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) setUser(JSON.parse(raw));
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    else localStorage.removeItem(AUTH_KEY);
  }, [user]);

  const login = async (username: string, email: string) => {
    const u = findUserByCredentials(username, email) || null;
    setUser(u);
    return u;
  };

  const registerFn = async (
    username: string,
    email: string,
    role: Role,
    departmentId?: string,
  ) => {
    const u = registerUser(username, email, role, departmentId);
    setUser(u);
    return u;
  };

  const logout = () => setUser(null);

  const value = useMemo(
    () => ({ user, login, register: registerFn, logout }),
    [user],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
