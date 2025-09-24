import { supabase } from "../supabaseClient";
import type { Profile, InsertProfile, UpdateProfile } from "@shared/schema";

export class ProfileService {
  /**
   * Get user profile by ID
   */
  static async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Not found
        return null;
      }
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }

    return data;
  }

  /**
   * Get all profiles (admin only)
   */
  static async getAllProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch profiles: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Create a new profile
   */
  static async createProfile(profileData: InsertProfile): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .insert(profileData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create profile: ${error.message}`);
    }

    return data;
  }

  /**
   * Update profile
   */
  static async updateProfile(
    userId: string,
    updates: UpdateProfile
  ): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    return data;
  }

  /**
   * Update user role (admin only)
   */
  static async updateRole(
    userId: string,
    role: "admin" | "subscriber" | "guest"
  ): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user role: ${error.message}`);
    }

    return data;
  }

  /**
   * Delete profile (admin only)
   */
  static async deleteProfile(userId: string): Promise<void> {
    const { error } = await supabase.from("profiles").delete().eq("id", userId);

    if (error) {
      throw new Error(`Failed to delete profile: ${error.message}`);
    }
  }

  /**
   * Sync profile with auth.users data
   */
  static async syncWithAuthUser(
    userId: string,
    authUserData: any
  ): Promise<Profile> {
    const fullName =
      authUserData.user_metadata?.full_name ||
      authUserData.raw_user_meta_data?.full_name ||
      "";

    // Try to get existing profile first
    let profile = await this.getProfile(userId);

    if (profile) {
      // Update existing profile if needed
      if (profile.full_name !== fullName) {
        profile = await this.updateProfile(userId, { full_name: fullName });
      }
    } else {
      // Create new profile
      profile = await this.createProfile({
        id: userId,
        full_name: fullName,
        role: "guest",
      });
    }

    return profile;
  }

  /**
   * Get users by role
   */
  static async getUsersByRole(
    role: "admin" | "subscriber" | "guest"
  ): Promise<Profile[]> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", role)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch users by role: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get profile statistics
   */
  static async getProfileStats() {
    const { data, error } = await supabase.from("profiles").select("role");

    if (error) {
      throw new Error(`Failed to fetch profile stats: ${error.message}`);
    }

    const stats = {
      total: data?.length || 0,
      admin: 0,
      subscriber: 0,
      guest: 0,
    };

    data?.forEach((profile) => {
      stats[profile.role as keyof typeof stats]++;
    });

    return stats;
  }
}
