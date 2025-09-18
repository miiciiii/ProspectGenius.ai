import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  authService,
  User,
  LoginCredentials,
  RegisterData,
} from "@/services/authService";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    credentials: LoginCredentials
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    userData: RegisterData
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUserRole: (
    userId: string,
    newRole: User["role"]
  ) => Promise<{ success: boolean; error?: string }>;
  getAllUsers: () => Promise<{
    success: boolean;
    users?: Omit<User, "token">[];
    error?: string;
  }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing user session on mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const result = await authService.loginUser(credentials);
      if (result.success && result.user) {
        setUser(result.user);
        navigate("/dashboard");
        return { success: true };
      } else {
        return { success: false, error: result.error || "Login failed" };
      }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      const result = await authService.registerUser(userData);
      if (result.success && result.user) {
        setUser(result.user);
        navigate("/dashboard");
        return { success: true };
      } else {
        return { success: false, error: result.error || "Registration failed" };
      }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logoutUser();
      setUser(null);
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: User["role"]) => {
    try {
      const result = await authService.updateUserRole(userId, newRole);
      if (result.success) {
        // Update current user if they updated their own role
        if (user && user.id === userId) {
          setUser({ ...user, role: newRole });
        }
      }
      return result;
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const getAllUsers = async () => {
    try {
      return await authService.getAllUsers();
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUserRole,
    getAllUsers,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Hook to check if user has specific role
export const useHasRole = (
  requiredRole: User["role"] | User["role"][]
): boolean => {
  const { user } = useAuth();

  if (!user) return false;

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.role);
  }

  return user.role === requiredRole;
};

// Hook to check if user is admin
export const useIsAdmin = (): boolean => {
  return useHasRole("admin");
};

// Hook to check if user has admin or subscriber role
export const useIsSubscriberOrAbove = (): boolean => {
  return useHasRole(["admin", "subscriber"]);
};
