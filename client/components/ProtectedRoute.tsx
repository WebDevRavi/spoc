import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/data/mock";

export function ProtectedRoute({ allow }: { allow: Role[] }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (!allow.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
}
