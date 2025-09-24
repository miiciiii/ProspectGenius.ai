import type {
  Plan,
  Subscription,
  Payment,
  SubscribeRequest,
  SubscriptionResponse,
} from "@shared/schema";
import { supabase } from "@/lib/supabaseClient";

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

export class SubscriptionService {
  /**
   * Get all available plans
   */
  static async getPlans(): Promise<Plan[]> {
    const response = await apiRequest("GET", "/api/plans");
    return await response.json();
  }

  /**
   * Get plan by ID
   */
  static async getPlan(planId: string): Promise<Plan> {
    const response = await apiRequest("GET", `/api/plans/${planId}`);
    return await response.json();
  }

  /**
   * Subscribe to a plan
   */
  static async subscribe(
    request: SubscribeRequest
  ): Promise<SubscriptionResponse> {
    const response = await apiRequest(
      "POST",
      "/api/subscription/subscribe",
      request
    );
    const subscriptionResponse: SubscriptionResponse = await response.json();

    // Ensure the subscription status is set to "active"
    if (subscriptionResponse.subscription) {
      subscriptionResponse.subscription.status = "active";
    }

    // Update the user's role to "subscriber"
    if (subscriptionResponse.subscription) {
      const userId = subscriptionResponse.subscription.user_id; // Assuming user_id is part of the subscription response
      await apiRequest("PATCH", `/profiles/${userId}/role`, {
        role: "subscriber",
      });
    }

    return subscriptionResponse;
  }

  /**
   * Get current user's subscription
   */
  static async getCurrentSubscription(): Promise<Subscription | null> {
    try {
      const response = await apiRequest("GET", "/api/subscription");
      return await response.json();
    } catch (error) {
      // Return null if no subscription found
      if (
        error instanceof Error &&
        error.message.includes("No subscription found")
      ) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Cancel current subscription
   */
  static async cancelSubscription(): Promise<{
    subscription: Subscription;
    message: string;
  }> {
    const response = await apiRequest("POST", "/api/subscription/cancel");
    return await response.json();
  }

  /**
   * Get payment history
   */
  static async getPaymentHistory(): Promise<Payment[]> {
    const response = await apiRequest("GET", "/api/subscription/payments");
    return await response.json();
  }

  /**
   * Check subscription status
   */
  static async getSubscriptionStatus(): Promise<{ is_active: boolean }> {
    const response = await apiRequest("GET", "/api/subscription/status");
    return await response.json();
  }

  /**
   * Get all subscriptions (admin only)
   */
  static async getAllSubscriptions(): Promise<Subscription[]> {
    const response = await apiRequest("GET", "/api/subscription/all");
    return await response.json();
  }

  /**
   * Create a new plan (admin only)
   */
  static async createPlan(
    plan: Omit<Plan, "id" | "created_at" | "updated_at">
  ): Promise<Plan> {
    const response = await apiRequest("POST", "/api/plans", plan);
    return await response.json();
  }

  /**
   * Update a plan (admin only)
   */
  static async updatePlan(
    planId: string,
    updates: Partial<Omit<Plan, "id" | "created_at" | "updated_at">>
  ): Promise<Plan> {
    const response = await apiRequest("PATCH", `/api/plans/${planId}`, updates);
    return await response.json();
  }

  /**
   * Helper: Check if user has active subscription
   */
  static async hasActiveSubscription(): Promise<boolean> {
    try {
      const status = await this.getSubscriptionStatus();
      return status.is_active;
    } catch (error) {
      return false;
    }
  }

  /**
   * Helper: Get user's current plan
   */
  static async getCurrentPlan(): Promise<Plan | null> {
    try {
      const subscription = await this.getCurrentSubscription();
      return subscription?.plan || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Helper: Check if user can access premium features
   */
  static async canAccessPremiumFeatures(): Promise<boolean> {
    try {
      const subscription = await this.getCurrentSubscription();

      if (!subscription) return false;

      // Check if subscription is active
      if (subscription.status !== "active") {
        return false;
      }

      // Check if subscription hasn't expired
      if (
        subscription.end_date &&
        new Date(subscription.end_date) < new Date()
      ) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}
