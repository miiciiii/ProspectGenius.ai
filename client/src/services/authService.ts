import { supabase } from "@/lib/supabaseClient";
import type { Profile } from "@shared/schema";

export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  profile?: Profile;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  full_name: string;
  email: string;
  password: string;
}

// Get the auth token for API requests
const getAuthToken = async (): Promise<string | null> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token || null;
};

// Make authenticated API requests
const apiRequest = async (method: string, endpoint: string, body?: any) => {
  const token = await getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL || ""}${endpoint}`,
    {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    }
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response;
};

export const authService = {
  // Register a new user
  registerUser: async (
    userData: RegisterData
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      // Sign up with Supabase Auth - require email confirmation
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name,
          },
          emailRedirectTo: `${window.location.origin}/auth/login`,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: "Registration failed" };
      }

      // Check if email confirmation is required
      if (!data.user.email_confirmed_at) {
        return {
          success: true,
          user: undefined,
          error:
            "Please check your email and click the confirmation link to complete registration.",
        };
      }

      // Sync profile with backend
      try {
        if (import.meta.env.VITE_API_URL) {
          await apiRequest("POST", "/api/auth/sync");
        }
      } catch (syncError) {
        console.warn("Profile sync failed (backend not available):", syncError);
      }

      // Get user profile
      let profile: Profile | null = null;
      try {
        profile = await authService.getCurrentUserProfile();
      } catch (profileError) {
        console.warn(
          "Could not fetch profile during registration:",
          profileError
        );
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        full_name: userData.full_name,
        role: profile?.role || "guest",
        profile: profile || undefined,
      };

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Registration failed",
      };
    }
  },

  // Login user
  loginUser: async (
    credentials: LoginCredentials
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    console.log("loginUser: Starting login process");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      console.log("loginUser: Supabase auth response:", data, error);

      if (error) {
        console.log("loginUser: Supabase auth error:", error);
        return { success: false, error: error.message };
      }

      if (!data.user) {
        console.log("loginUser: No user returned from Supabase");
        return { success: false, error: "Login failed" };
      }

      // Check if email is confirmed
      if (!data.user.email_confirmed_at) {
        console.log("loginUser: Email not confirmed");
        return {
          success: false,
          error: "Please confirm your email address before logging in.",
        };
      }

      console.log("loginUser: Supabase auth successful, fetching profile");

      // Fetch the user profile to get the correct role
      let profile: Profile | null = null;
      try {
        console.log("loginUser: Fetching profile from database");
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (profileError) {
          console.log("loginUser: Profile fetch error:", profileError);
          // If profile doesn't exist, create one
          if (profileError.code === "PGRST116") {
            console.log("loginUser: Profile not found, creating new profile");
            const { data: newProfile, error: createError } = await supabase
              .from("profiles")
              .insert({
                id: data.user.id,
                full_name: data.user.user_metadata?.full_name || "",
                role: "guest",
              })
              .select()
              .single();

            if (createError) {
              console.log("loginUser: Error creating profile:", createError);
            } else {
              profile = newProfile;
              console.log("loginUser: Created new profile:", profile);
            }
          }
        } else {
          profile = profileData;
          console.log("loginUser: Profile fetched successfully:", profile);
        }
      } catch (profileError) {
        console.warn(
          "loginUser: Could not fetch/create profile:",
          profileError
        );
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        full_name:
          profile?.full_name || data.user.user_metadata?.full_name || "",
        role: profile?.role || "guest", // Use role from profiles table, not from auth.user
        profile: profile || undefined,
      };

      console.log("loginUser: Login completed successfully with user:", user);
      return { success: true, user };
    } catch (error) {
      console.log("loginUser: Unexpected error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  },

  // Logout user
  logoutUser: async (): Promise<void> => {
    await supabase.auth.signOut();
  },

  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("getCurrentUser: Supabase user:", user);

      if (!user) return null;

      // Try to get profile, but don't fail if it doesn't exist
      let profile: Profile | null = null;
      try {
        profile = await authService.getCurrentUserProfile();
      } catch (profileError) {
        console.warn(
          "Could not fetch profile, using default role:",
          profileError
        );
      }

      return {
        id: user.id,
        email: user.email!,
        full_name: profile?.full_name || user.user_metadata?.full_name || "",
        role: profile?.role || "guest", // Default to guest if no profile
        profile: profile || undefined,
      };
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  },

  // Get current user profile from backend
  getCurrentUserProfile: async (): Promise<Profile | null> => {
    console.log("getCurrentUserProfile: Starting profile fetch");
    try {
      // First check if backend is available
      if (!import.meta.env.VITE_API_URL) {
        console.warn("Backend API URL not configured, using default role");
        return null;
      }

      console.log("getCurrentUserProfile: Making API request to backend");
      const response = await apiRequest("GET", "/api/auth/profile");
      const data = await response.json();
      console.log("getCurrentUserProfile: Backend response:", data);
      return data.user?.profile || null;
    } catch (error) {
      console.warn(
        "Backend not available, using Supabase profile data:",
        error
      );

      // Fallback: try to get profile directly from Supabase
      try {
        console.log("getCurrentUserProfile: Trying Supabase fallback");
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          console.log("getCurrentUserProfile: No user found in Supabase");
          return null;
        }

        console.log(
          "getCurrentUserProfile: Fetching profile from Supabase for user:",
          user.id
        );
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.warn(
            "getCurrentUserProfile: Supabase profile error:",
            profileError
          );
        }

        console.log("getCurrentUserProfile: Supabase profile result:", profile);
        return profile || null;
      } catch (supabaseError) {
        console.warn("Supabase profile fetch failed:", supabaseError);
        return null;
      }
    }
  },

  // Update user profile
  updateProfile: async (updates: {
    full_name?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      await apiRequest("PATCH", "/api/auth/profile", updates);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update profile",
      };
    }
  },

  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return !!session;
  },

  // Update user role (admin only functionality)
  updateUserRole: async (
    userId: string,
    newRole: User["role"]
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await apiRequest("PATCH", `/api/auth/profiles/${userId}/role`, {
        role: newRole,
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update user role",
      };
    }
  },

  // Get all users (admin only)
  getAllUsers: async (): Promise<{
    success: boolean;
    users?: Omit<User, "token">[];
    error?: string;
  }> => {
    try {
      const response = await apiRequest("GET", "/api/auth/profiles");
      const profiles = await response.json();

      const users = profiles.map((profile: Profile) => ({
        id: profile.id,
        email: "", // Email not returned for privacy
        full_name: profile.full_name,
        role: profile.role,
      }));

      return { success: true, users };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch users",
      };
    }
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (user: User | null) => void) => {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("onAuthStateChange: Event:", event, "Session:", !!session);
      if (session?.user) {
        // Try to get profile with timeout, but don't fail if it doesn't work
        let profile: Profile | null = null;
        try {
          console.log("onAuthStateChange: Fetching profile with timeout");
          // Add a timeout to prevent hanging
          const profilePromise = authService.getCurrentUserProfile();
          const timeoutPromise = new Promise<null>((_, reject) =>
            setTimeout(() => reject(new Error("Profile fetch timeout")), 10000)
          );

          profile = await Promise.race([profilePromise, timeoutPromise]);
          console.log("onAuthStateChange: Profile fetch successful:", profile);
        } catch (profileError) {
          console.warn(
            "Could not fetch profile during auth state change:",
            profileError
          );
        }

        const user: User = {
          id: session.user.id,
          email: session.user.email!,
          full_name:
            profile?.full_name || session.user.user_metadata?.full_name || "",
          role: profile?.role || "guest",
          profile: profile || undefined,
        };
        // console.log("onAuthStateChange: Calling callback with user:", user);
        callback(user);
      } else {
        console.log(
          "onAuthStateChange: No session, calling callback with null"
        );
        callback(null);
      }
    });
  },
};
