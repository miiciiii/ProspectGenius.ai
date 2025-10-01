import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, useHasRole } from "@/context/auth-context";
import { User } from "@/services/authService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Crown, User as UserIcon } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: User["role"] | User["role"][];
  fallback?: ReactNode;
}

const getRoleIcon = (role: User["role"]) => {
  switch (role) {
    case "admin":
      return <Crown className="h-4 w-4" />;
    case "subscriber":
      return <Shield className="h-4 w-4" />;
    case "guest":
      return <UserIcon className="h-4 w-4" />;
    default:
      return <UserIcon className="h-4 w-4" />;
  }
};

const getRoleLabel = (role: User["role"]) => {
  switch (role) {
    case "admin":
      return "Administrator";
    case "subscriber":
      return "Subscriber";
    case "guest":
      return "Guest";
    default:
      return "Unknown";
  }
};

const InsufficientPermissions: React.FC<{
  userRole: User["role"];
  requiredRole: User["role"] | User["role"][];
}> = ({ userRole, requiredRole }) => {
  const { logout } = useAuth();

  const requiredRoleText = Array.isArray(requiredRole)
    ? requiredRole.map(getRoleLabel).join(" or ")
    : getRoleLabel(requiredRole);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              You don't have sufficient permissions to access this page.
            </AlertDescription>
          </Alert>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">Your role:</span>
              <span className="flex items-center gap-1">
                {getRoleIcon(userRole)}
                {getRoleLabel(userRole)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Required:</span>
              <span>{requiredRoleText}</span>
            </div>
          </div>

          {userRole === "guest" && (
            <div className="space-y-3">
              <Alert>
                <AlertDescription>
                  Upgrade your account to access premium features.
                </AlertDescription>
              </Alert>
              <Button className="w-full" variant="default">
                Upgrade Account
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="w-full">
              Go Back
            </Button>
            <Button onClick={() => logout()} variant="ghost" className="w-full">
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallback,
}) => {
  const { user, isLoading } = useAuth();
  // Determine effective role from user or profile
  const effectiveRole = (user?.role || (user as any)?.profile?.role) as
    | User["role"]
    | undefined;
  const hasRequiredRole = useHasRole(requiredRole || []);
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Redirect to landing if not authenticated
  if (!user) {
    // return <Navigate to="/auth/login" state={{ from: location }} replace />;
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && !hasRequiredRole) {
    // Debug logging to help diagnose unexpected permission denials
    try {
      // eslint-disable-next-line no-console
      console.warn("ProtectedRoute: access denied", {
        user,
        effectiveRole,
        requiredRole,
        hasRequiredRole,
      });
    } catch (e) {}
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <InsufficientPermissions
        userRole={effectiveRole ?? user?.role ?? "guest"}
        requiredRole={requiredRole}
      />
    );
  }

  return <>{children}</>;
};

// Convenience components for common role checks
export const AdminRoute: React.FC<{
  children: ReactNode;
  fallback?: ReactNode;
}> = ({ children, fallback }) => (
  <ProtectedRoute requiredRole="admin" fallback={fallback}>
    {children}
  </ProtectedRoute>
);

export const SubscriberRoute: React.FC<{
  children: ReactNode;
  fallback?: ReactNode;
}> = ({ children, fallback }) => (
  <ProtectedRoute requiredRole={["admin", "subscriber"]} fallback={fallback}>
    {children}
  </ProtectedRoute>
);

// Component to show upgrade banner for guests
export const GuestUpgradeBanner: React.FC = () => {
  const { user } = useAuth();

  if (!user || user.role !== "guest") {
    return null;
  }

  return (
    <Alert className="mb-4">
      <Crown className="h-4 w-4" />
      <AlertDescription className="space-y-3">
        <div>Upgrade your account to unlock all features</div>
        <Button size="sm" variant="default" className="w-full">
          Upgrade Now
        </Button>
      </AlertDescription>
    </Alert>
  );
};
