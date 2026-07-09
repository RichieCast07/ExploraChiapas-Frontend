import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import type { UserType } from "../../../features/Auth/data/models/User";
import {
  getToken,
  getUserRole,
} from "../utils/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserType[];
}

function getHomeForRole(
  role: UserType | null
): string {
  switch (role) {
    case "admin_plataforma":
      return "/admin/dashboard";

    case "admin_negocio":
      return "/negocio/inicio";

    default:
      return "/login";
  }
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const token = getToken();
  const role = getUserRole();

  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(role)
  ) {
    return (
      <Navigate
        to={getHomeForRole(role)}
        replace
      />
    );
  }

  return <>{children}</>;
}