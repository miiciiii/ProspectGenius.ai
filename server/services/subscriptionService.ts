import { supabase } from "../supabaseClient";
import type {
  Plan,
  Subscription,
  Payment,
  InsertSubscription,
  UpdateSubscription,
  InsertPayment,
} from "@shared/schema";
import { ProfileService } from "./profileService";

export class SubscriptionService {
  /**
   * Get all active plans
   */
  static async getPlans(): Promise<Plan[]> {
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .eq("is_active", true)
      .order("price", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch plans: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get plan by ID
   */
  static async getPlan(planId: string): Promise<Plan | null> {
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .eq("id", planId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Not found
        return null;
      }
      throw new Error(`Failed to fetch plan: ${error.message}`);
    }

    return data;
  }

  /**
   * Create a new plan (admin only)
   */
  static async createPlan(
    planData: Omit<Plan, "id" | "created_at" | "updated_at">
  ): Promise<Plan> {
    const { data, error } = await supabase
      .from("plans")
      .insert(planData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create plan: ${error.message}`);
    }

    return data;
  }

  /**
   * Update plan (admin only)
   */
  static async updatePlan(
    planId: string,
    updates: Partial<Omit<Plan, "id" | "created_at" | "updated_at">>
  ): Promise<Plan> {
    const { data, error } = await supabase
      .from("plans")
      .update(updates)
      .eq("id", planId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update plan: ${error.message}`);
    }

    return data;
  }

  /**
   * Get user's subscription
   */
  static async getUserSubscription(
    userId: string
  ): Promise<Subscription | null> {
    const { data, error } = await supabase
      .from("subscriptions")
      .select(
        `
        *,
        plan:plans(*)
      `
      )
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Not found
        return null;
      }
      throw new Error(`Failed to fetch subscription: ${error.message}`);
    }

    return data;
  }

  /**
   * Create subscription
   */
  static async createSubscription(
    subscriptionData: InsertSubscription
  ): Promise<Subscription> {
    const { data, error } = await supabase
      .from("subscriptions")
      .insert(subscriptionData)
      .select(
        `
        *,
        plan:plans(*)
      `
      )
      .single();

    if (error) {
      throw new Error(`Failed to create subscription: ${error.message}`);
    }

    return data;
  }

  /**
   * Update subscription
   */
  static async updateSubscription(
    subscriptionId: string,
    updates: UpdateSubscription
  ): Promise<Subscription> {
    const { data, error } = await supabase
      .from("subscriptions")
      .update(updates)
      .eq("id", subscriptionId)
      .select(
        `
        *,
        plan:plans(*)
      `
      )
      .single();

    if (error) {
      throw new Error(`Failed to update subscription: ${error.message}`);
    }

    return data;
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(userId: string): Promise<Subscription> {
    const { data, error } = await supabase
      .from("subscriptions")
      .update({
        status: "canceled",
        end_date: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select(
        `
        *,
        plan:plans(*)
      `
      )
      .single();

    if (error) {
      throw new Error(`Failed to cancel subscription: ${error.message}`);
    }

    // Update user role back to guest when subscription is cancelled
    await ProfileService.updateRole(userId, "guest");

    return data;
  }

  /**
   * Subscribe user to a plan
   */
  static async subscribeUser(
    userId: string,
    planId: string,
    options: {
      external_subscription_id?: string;
    } = {}
  ): Promise<Subscription> {
    // First, check if user already has a subscription
    const existingSubscription = await this.getUserSubscription(userId);

    if (existingSubscription && existingSubscription.status === "active") {
      throw new Error("User already has an active subscription");
    }

    // Calculate dates
    const startDate = new Date();

    const subscriptionData: InsertSubscription = {
      user_id: userId,
      plan_id: planId,
      status: "active",
      start_date: startDate.toISOString(),
      end_date: null,
      external_subscription_id: options.external_subscription_id || null,
    };

    // If user has an existing subscription, update it instead of creating new
    if (existingSubscription) {
      const subscription = await this.updateSubscription(
        existingSubscription.id,
        subscriptionData
      );
      // Update user role to subscriber
      await ProfileService.updateRole(userId, "subscriber");
      return subscription;
    }

    const subscription = await this.createSubscription(subscriptionData);
    // Update user role to subscriber
    await ProfileService.updateRole(userId, "subscriber");
    return subscription;
  }

  /**
   * Check if subscription is active
   */
  static async isSubscriptionActive(userId: string): Promise<boolean> {
    const subscription = await this.getUserSubscription(userId);

    if (!subscription) return false;
    if (subscription.status !== "active") return false;

    // Check if subscription hasn't expired
    if (subscription.end_date && new Date(subscription.end_date) < new Date()) {
      return false;
    }

    return true;
  }

  /**
   * Get all subscriptions (admin only)
   */
  static async getAllSubscriptions(): Promise<Subscription[]> {
    const { data, error } = await supabase
      .from("subscriptions")
      .select(
        `
        *,
        plan:plans(*),
        profile:profiles(full_name, role)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch subscriptions: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Record a payment
   */
  static async recordPayment(paymentData: InsertPayment): Promise<Payment> {
    const { data, error } = await supabase
      .from("payments")
      .insert(paymentData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to record payment: ${error.message}`);
    }

    return data;
  }

  /**
   * Get payments for a subscription
   */
  static async getSubscriptionPayments(
    subscriptionId: string
  ): Promise<Payment[]> {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("subscription_id", subscriptionId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch payments: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get user's payment history
   */
  static async getUserPayments(userId: string): Promise<Payment[]> {
    const { data, error } = await supabase
      .from("payments")
      .select(
        `
        *,
        subscription:subscriptions!inner(user_id)
      `
      )
      .eq("subscription.user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch user payments: ${error.message}`);
    }

    return data || [];
  }
}
