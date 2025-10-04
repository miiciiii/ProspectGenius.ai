import { ReactNode, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserAccess } from "@/hooks/useUserAccess";
import { Loader2 } from "lucide-react";
import AccessDenied from "../accessDenied";
import { useLocation } from "wouter";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
  allowedPlans: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  allowedPlans,
}: ProtectedRouteProps) {
  const [location, setLocation] = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { role, plan, loading: accessLoading } = useUserAccess(user, authLoading);

  const isLoading = authLoading || accessLoading;

  // Normalize allowed roles/plans once
  const allowedRolesNormalized = useMemo(() => allowedRoles.map(r => r.toLowerCase()), [allowedRoles]);
  const allowedPlansNormalized = useMemo(() => allowedPlans.map(p => p.toLowerCase()), [allowedPlans]);

  const isAllowed = useMemo(() => {
    if (!user) return false;
    const userRole = role.toLowerCase();
    const userPlan = plan.toLowerCase();
    return allowedRolesNormalized.includes(userRole) && allowedPlansNormalized.includes(userPlan);
  }, [user, role, plan, allowedRolesNormalized, allowedPlansNormalized]);

  // Show loader while checking auth/access
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  // Optional: redirect unauthenticated users
  if (!user) {
    setLocation("/signin");
    return null;
  }

  if (!isAllowed) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
