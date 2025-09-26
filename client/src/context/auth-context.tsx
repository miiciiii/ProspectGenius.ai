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
import type { Profile } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    credentials: LoginCredentials
  ) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{
    success: boolean;
    requiresConfirmation?: boolean;
    error?: string;
  }>;
  logout: () => Promise<void>;
  updateProfile: (updates: {
    full_name?: string;
  }) => Promise<{ success: boolean; error?: string }>;
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
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize user and set up auth state listener
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        console.log("getCurrentUser:", currentUser);
        if (mounted) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // initializeAuth();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = authService.onAuthStateChange((user) => {
      if (mounted) {
        setUser(user);
        if (!user && window.location.pathname.startsWith("/dashboard")) {
          navigate("/auth/login");
        }
      }
    });

    // Initialize auth state
    initializeAuth();

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [navigate]);

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Error refreshing user:", error);
      setUser(null);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    console.log("AuthContext login: Starting login");
    setIsLoading(true);
    try {
      const result = await authService.loginUser(credentials);
      console.log("AuthContext login: authService result:", result);
      if (result.success) {
        console.log(
          "AuthContext login: Login successful, auth state change will update user"
        );
        // Don't navigate here - let the auth state change and routing handle navigation
        return { success: true };
      } else {
        console.log("AuthContext login: Login failed:", result.error);
        return { success: false, error: result.error || "Login failed" };
      }
    } catch (error) {
      console.log("AuthContext login: Unexpected error:", error);
      return { success: false, error: "An unexpected error occurred" };
    } finally {
      console.log("AuthContext login: Setting loading to false");
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      const result = await authService.registerUser(userData);
      if (result.success) {
        if (result.user) {
          // User is confirmed and can proceed
          setUser(result.user);
          navigate("/dashboard");
        } else {
          // User needs email confirmation
          // Don't set user or navigate - let the UI show the confirmation message
        }
        return { success: true, requiresConfirmation: !result.user };
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
      // navigate("/auth/login");
      navigate("/"); // Redirect to landing page after logout
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: { full_name?: string }) => {
    try {
      const result = await authService.updateProfile(updates);
      if (result.success) {
        // Refresh user data
        await refreshUser();
      }
      return result;
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" };
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
    updateProfile,
    updateUserRole,
    getAllUsers,
    isAuthenticated: !!user,
    refreshUser,
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
