// Mock authentication service using localStorage
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "subscriber" | "guest";
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Mock users database (in real app this would be on the server)
const MOCK_USERS_KEY = "prospect_genius_users";
const CURRENT_USER_KEY = "prospect_genius_current_user";

// Initialize with some default users
const initializeMockUsers = () => {
  const existingUsers = localStorage.getItem(MOCK_USERS_KEY);
  if (!existingUsers) {
    const defaultUsers = [
      {
        id: "1",
        name: "Admin User",
        email: "admin@example.com",
        password: "admin123",
        role: "admin" as const,
      },
      {
        id: "2",
        name: "Subscriber User",
        email: "subscriber@example.com",
        password: "subscriber123",
        role: "subscriber" as const,
      },
      {
        id: "3",
        name: "Guest User",
        email: "guest@example.com",
        password: "guest123",
        role: "guest" as const,
      },
    ];
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(defaultUsers));
  }
};

// Initialize mock users on module load
initializeMockUsers();

const generateToken = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const getMockUsers = () => {
  const users = localStorage.getItem(MOCK_USERS_KEY);
  return users ? JSON.parse(users) : [];
};

const saveMockUsers = (users: any[]) => {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
};

export const authService = {
  // Register a new user
  registerUser: async (
    userData: RegisterData
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = getMockUsers();

        // Check if user already exists
        const existingUser = users.find(
          (user: any) => user.email === userData.email
        );
        if (existingUser) {
          resolve({
            success: false,
            error: "User already exists with this email",
          });
          return;
        }

        // Create new user
        const newUser = {
          id: (users.length + 1).toString(),
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: "subscriber" as const, // Default role for new users
        };

        users.push(newUser);
        saveMockUsers(users);

        // Create user object without password
        const userWithToken: User = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          token: generateToken(),
        };

        // Store current user
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithToken));

        resolve({ success: true, user: userWithToken });
      }, 500); // Simulate network delay
    });
  },

  // Login user
  loginUser: async (
    credentials: LoginCredentials
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = getMockUsers();

        // Find user with matching email and password
        const user = users.find(
          (u: any) =>
            u.email === credentials.email && u.password === credentials.password
        );

        if (!user) {
          resolve({ success: false, error: "Invalid email or password" });
          return;
        }

        // Create user object without password
        const userWithToken: User = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(),
        };

        // Store current user
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithToken));

        resolve({ success: true, user: userWithToken });
      }, 500); // Simulate network delay
    });
  },

  // Logout user
  logoutUser: async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem(CURRENT_USER_KEY);
        resolve();
      }, 100);
    });
  },

  // Get current user
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    if (!userJson) return null;

    try {
      return JSON.parse(userJson);
    } catch {
      // If JSON is corrupted, remove it
      localStorage.removeItem(CURRENT_USER_KEY);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return authService.getCurrentUser() !== null;
  },

  // Update user role (admin only functionality)
  updateUserRole: async (
    userId: string,
    newRole: User["role"]
  ): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser || currentUser.role !== "admin") {
          resolve({
            success: false,
            error: "Unauthorized: Admin access required",
          });
          return;
        }

        const users = getMockUsers();
        const userIndex = users.findIndex((u: any) => u.id === userId);

        if (userIndex === -1) {
          resolve({ success: false, error: "User not found" });
          return;
        }

        users[userIndex].role = newRole;
        saveMockUsers(users);

        // Update current user if they're updating their own role
        if (currentUser.id === userId) {
          const updatedUser = { ...currentUser, role: newRole };
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
        }

        resolve({ success: true });
      }, 300);
    });
  },

  // Get all users (admin only)
  getAllUsers: async (): Promise<{
    success: boolean;
    users?: Omit<User, "token">[];
    error?: string;
  }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser || currentUser.role !== "admin") {
          resolve({
            success: false,
            error: "Unauthorized: Admin access required",
          });
          return;
        }

        const users = getMockUsers();
        const usersWithoutPasswords = users.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }));

        resolve({ success: true, users: usersWithoutPasswords });
      }, 300);
    });
  },
};