export interface FundedCompany {
  id: string;
  source: string;
  company_name: string;
  domain?: string | null;
  funding_date: string; // ISO date string (YYYY-MM-DD)
  funding_stage: string;
  funding_amount: number;
  investors?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  social_media?: string[] | null;
  industry?: string | null;
  status: "new" | "contacted" | "follow-up" | string;
  created_at: string; // ISO timestamp
}

export type InsertFundedCompany = Omit<FundedCompany, "id" | "created_at">;

export interface CompanyFilters {
  search?: string;
  date_range?: "week" | "month" | "quarter" | "all";
  funding_stage?: string;
  industry?: string;
  status?: string;
}

export interface DashboardStats {
  total_companies: number;
  this_week: number;
  total_funding: string;
  contacted: number;
}

// Auth & User Management
export interface Profile {
  id: string;
  full_name?: string | null;
  role: "admin" | "subscriber" | "guest";
  created_at: string;
  updated_at: string;
}

export type InsertProfile = Omit<Profile, "created_at" | "updated_at">;
export type UpdateProfile = Partial<
  Omit<Profile, "id" | "created_at" | "updated_at">
>;

// Subscription Management
export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type InsertPlan = Omit<Plan, "id" | "created_at" | "updated_at">;
export type UpdatePlan = Partial<
  Omit<Plan, "id" | "created_at" | "updated_at">
>;

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: "active" | "canceled" | "past_due" | "incomplete";
  start_date: string;
  end_date?: string | null;
  external_subscription_id?: string | null;
  created_at: string;
  updated_at: string;
  plan?: Plan; // Optional populated plan data
}

export type InsertSubscription = Omit<
  Subscription,
  "id" | "created_at" | "updated_at" | "plan"
>;
export type UpdateSubscription = Partial<
  Omit<Subscription, "id" | "user_id" | "created_at" | "updated_at" | "plan">
>;

export interface Payment {
  id: string;
  subscription_id: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  transaction_id?: string | null;
  payment_method?: string | null;
  processed_at?: string | null;
  created_at: string;
}

export type InsertPayment = Omit<Payment, "id" | "created_at">;

// API Request/Response types
export interface AuthUser {
  id: string;
  email: string;
  profile?: Profile;
}

export interface SubscribeRequest {
  plan_id: string;
  payment_method?: string;
}

export interface SubscriptionResponse {
  subscription: Subscription;
  payment_url?: string; // For external payment processing
}
