/**
 * First-time setup helper for creating initial admin user
 */
import { supabase } from "../supabaseClient";

interface SetupOptions {
  email: string;
  password: string;
  fullName?: string;
}

export class SetupService {
  /**
   * Create the first admin user if no admins exist
   */
  static async createFirstAdmin(options: SetupOptions): Promise<void> {
    try {
      // Check if any admin users already exist
      const { data: existingAdmins, error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "admin")
        .limit(1);

      if (checkError) {
        throw new Error(
          `Failed to check existing admins: ${checkError.message}`
        );
      }

      if (existingAdmins && existingAdmins.length > 0) {
        console.log("ℹ️  Admin user already exists, skipping setup");
        return;
      }

      console.log("🔧 No admin users found, creating first admin...");

      // Create the user account
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email: options.email,
          password: options.password,
          options: {
            data: {
              full_name: options.fullName || "Admin User",
            },
          },
        }
      );

      if (signUpError) {
        throw new Error(`Failed to create user: ${signUpError.message}`);
      }

      if (!authData.user) {
        throw new Error("User creation failed - no user returned");
      }

      // Wait a moment for the profile trigger to create the profile
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update the profile to admin role using service role key
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          role: "admin",
          full_name: options.fullName || "Admin User",
        })
        .eq("id", authData.user.id);

      if (updateError) {
        throw new Error(`Failed to update role: ${updateError.message}`);
      }

      console.log(`✅ First admin user created successfully!`);
      console.log(`📧 Email: ${options.email}`);
      console.log(`🆔 User ID: ${authData.user.id}`);
      console.log(`🔑 Role: admin`);
    } catch (error) {
      console.error(
        `❌ Setup failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw error;
    }
  }

  /**
   * Check if setup is needed (no admin users exist)
   */
  static async isSetupNeeded(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "admin")
        .limit(1);

      if (error) {
        console.error("Failed to check setup status:", error.message);
        return false;
      }

      return !data || data.length === 0;
    } catch (error) {
      console.error("Setup check failed:", error);
      return false;
    }
  }

  /**
   * Promote an existing user to admin
   */
  static async promoteToAdmin(email: string): Promise<void> {
    try {
      // Find user by email (requires admin access to auth.users)
      const { data: users, error: listError } =
        await supabase.auth.admin.listUsers();

      if (listError) {
        throw new Error(`Failed to list users: ${listError.message}`);
      }

      const user = users.users.find((u: any) => u.email === email);

      if (!user) {
        throw new Error(`User with email ${email} not found`);
      }

      // Update their role
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", user.id);

      if (updateError) {
        throw new Error(`Failed to update role: ${updateError.message}`);
      }

      console.log(`✅ Successfully promoted ${email} to admin`);
    } catch (error) {
      console.error(
        `❌ Failed to promote user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw error;
    }
  }
}
