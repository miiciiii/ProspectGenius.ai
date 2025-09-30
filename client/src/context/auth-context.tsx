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
import { supabase } from "@/lib/supabaseClient";
import type { Profile } from "@shared/schema";
import { useAppDispatch, useAppSelector } from "@/store";
import { persistor } from "@/store";
import {
  loginSuccess as loginSuccessAction,
  logout as logoutAction,
  updateProfile as updateProfileAction,
} from "@/store/authSlice";

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

// Helper to normalize user objects before storing to Redux
const normalizeUser = (raw: any): User => {
  if (!raw) return raw;
  const profile = raw.profile || (raw as any)?.profile?.profile || null;
  const role = raw.role || (profile && profile.role) || "guest";
  const id = raw.id || (profile && profile.id) || null;
  return {
    id,
    email: raw.email || (profile && profile.email) || "",
    full_name: raw.full_name || (profile && profile.full_name) || "",
    role,
    profile: profile || undefined,
  } as User;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const user = useAppSelector((s) => s.auth.userProfile) as User | null;
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Initialize user and set up auth state listener
  useEffect(() => {
    let mounted = true;
    let lastDispatchedUserId: string | null = null;

    const initializeAuth = async () => {
      try {
        // Use Supabase to get session user without fetching backend profile
        const {
          data: { user: sbUser },
        } = await supabase.auth.getUser();
        console.log("AuthProvider: Supabase user on init:", sbUser);
        if (mounted && sbUser) {
          // If we already have a stored profile in Redux and it matches, reuse it
          if (user && (user as any).id === sbUser.id) {
            if (sbUser.id !== lastDispatchedUserId) {
              lastDispatchedUserId = sbUser.id;
              console.log(
                "AuthProvider: Reusing stored Redux profile for user",
                sbUser.id
              );
              dispatch(
                loginSuccessAction({
                  userProfile: user as any,
                  subscription: (user as any)?.subscription ?? null,
                })
              );
            }
          } else {
            // Fetch profile once and store it
            console.log(
              "AuthProvider: No stored profile found for user",
              sbUser.id,
              "— fetching from backend once"
            );
            const profile = await authService.getCurrentUserProfile();
            const composed = {
              id: profile?.id || sbUser.id,
              email: sbUser.email || "",
              full_name:
                profile?.full_name ||
                (sbUser as any)?.user_metadata?.full_name ||
                "",
              role: profile?.role || "guest",
              profile: profile || undefined,
            } as User;
            if (sbUser.id !== lastDispatchedUserId) {
              lastDispatchedUserId = sbUser.id;
              dispatch(
                loginSuccessAction({
                  userProfile: normalizeUser(composed) as any,
                  subscription: (composed as any)?.subscription ?? null,
                })
              );
            }
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (mounted) {
          dispatch(logoutAction());
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
        if (user) {
          // If we already have the profile stored, reuse it; otherwise fetch once
          if (user.id !== lastDispatchedUserId) {
            lastDispatchedUserId = user.id;
            if (user && (user as any).profile) {
              console.log(
                "AuthProvider: onAuthStateChange - reusing stored profile for",
                user.id
              );
              dispatch(
                loginSuccessAction({
                  userProfile: normalizeUser(user as any) as any,
                  subscription: (user as any)?.subscription ?? null,
                })
              );
            } else if (user) {
              // attempt to reuse stored profile in Redux if present
              if (
                user &&
                (user as any).id &&
                (user as any).id === (user as any).id &&
                typeof (user as any).profile === "undefined" &&
                (user as any)
              ) {
                // fallback: fetch profile once
                console.log(
                  "AuthProvider: onAuthStateChange - fetching profile once for",
                  user.id
                );
                authService
                  .getCurrentUserProfile()
                  .then((profile) => {
                    const composed = {
                      id: profile?.id || user.id,
                      email: user.email || "",
                      full_name:
                        profile?.full_name ||
                        (user as any)?.user_metadata?.full_name ||
                        "",
                      role: profile?.role || "guest",
                      profile: profile || undefined,
                    } as User;
                    dispatch(
                      loginSuccessAction({
                        userProfile: normalizeUser(composed) as any,
                        subscription: (composed as any)?.subscription ?? null,
                      })
                    );
                  })
                  .catch(() => {
                    // if profile fetch fails, still dispatch minimal user
                    dispatch(
                      loginSuccessAction({
                        userProfile: normalizeUser(user as any) as any,
                        subscription: (user as any)?.subscription ?? null,
                      })
                    );
                  });
              } else {
                dispatch(
                  loginSuccessAction({
                    userProfile: normalizeUser(user as any) as any,
                    subscription: (user as any)?.subscription ?? null,
                  })
                );
              }
            }
          }
        } else {
          if (lastDispatchedUserId !== null) {
            lastDispatchedUserId = null;
            dispatch(logoutAction());
          }
        }
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
      if (currentUser) {
        dispatch(
          loginSuccessAction({
            userProfile: currentUser as any,
            subscription: (currentUser as any)?.subscription ?? null,
          })
        );
      } else {
        dispatch(logoutAction());
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
      dispatch(logoutAction());
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
          dispatch(
            loginSuccessAction({
              userProfile: result.user as any,
              subscription: (result.user as any)?.subscription ?? null,
            })
          );
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
      // First purge persisted store to remove stored profile immediately
      try {
        await persistor.purge();
      } catch (e) {
        console.warn("Failed to purge persisted store on logout", e);
      }

      // Clear any in-memory caches in the authService
      try {
        // authService.logoutUser will also clear caches; call it after purge
        await authService.logoutUser();
      } catch (e) {
        console.warn("Error during authService.logoutUser():", e);
      }

      // Update Redux state to logged out
      dispatch(logoutAction());

      // Redirect to landing page after logout
      navigate("/");
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
        // update Redux profile with the updates
        dispatch(updateProfileAction(updates as any));
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
          // merge role into the stored profile
          dispatch(
            updateProfileAction({
              ...((user as any) || {}),
              role: newRole,
            } as any)
          );
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
    user: user as User | null,
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

  // Resolve role: prefer top-level user.role, fallback to profile.role
  const effectiveRole: User["role"] = (user.role ||
    (user as any)?.profile?.role) as User["role"];

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(effectiveRole);
  }

  return effectiveRole === requiredRole;
};

// Hook to check if user is admin
export const useIsAdmin = (): boolean => {
  return useHasRole("admin");
};

// Hook to check if user has admin or subscriber role
export const useIsSubscriberOrAbove = (): boolean => {
  return useHasRole(["admin", "subscriber"]);
};
