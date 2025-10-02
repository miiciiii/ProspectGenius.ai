import { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import AccessDenied from "../accessDenied";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { role, loading } = useUserRole();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!role || !allowedRoles.includes(role)) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
