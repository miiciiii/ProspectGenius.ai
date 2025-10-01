import React, {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useMemo,
  useState,
} from "react";
import { SubscriptionService } from "@/services/subscriptionService";
import { useAppDispatch, useAppSelector } from "@/store";
import { updateSubscription as updateSubscriptionAction } from "@/store/authSlice";
import { useAuth } from "@/context/auth-context";
import type { Subscription, Plan } from "@shared/schema";

interface SubscriptionContextType {
  subscription: Subscription | null;
  currentPlan: Plan | null;
  isLoading: boolean;
  hasActiveSubscription: boolean;
  canAccessPremiumFeatures: boolean;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({
  children,
}) => {
  const subscription = useAppSelector(
    (s) => s.auth.subscription
  ) as Subscription | null;
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated, refreshUser } = useAuth();
  const dispatch = useAppDispatch();
  console.log("SubscriptionProvider - user:", user);
  // prevent multiple concurrent refreshes and short-lived re-fetch storms
  const inFlightRef = React.useRef<boolean>(false);
  const lastFetchedAtRef = React.useRef<number | null>(null);

  const refreshSubscription = async () => {
    // avoid re-fetching if a fetch is in-flight
    if (inFlightRef.current) return;

    // short cache window: skip fetch if last fetched < 5s ago
    const now = Date.now();
    if (lastFetchedAtRef.current && now - lastFetchedAtRef.current < 5000) {
      return;
    }

    inFlightRef.current = true;
    if (!isAuthenticated || !user) {
      dispatch(updateSubscriptionAction(null as any));
      inFlightRef.current = false;
      return;
    }

    const previous = subscription;
    try {
      setIsLoading(true);
      const subscriptionData =
        await SubscriptionService.getCurrentSubscription();
      console.log(
        "SubscriptionProvider: fetched subscription",
        subscriptionData
      );
      dispatch(updateSubscriptionAction(subscriptionData as any));
      lastFetchedAtRef.current = Date.now();
    } catch (error) {
      console.error("Error fetching subscription:", error);
      // Don't immediately clear the user's subscription on transient errors.
      // Keep the previous subscription for a short grace window and retry
      // on the next refresh.
      if (previous) {
        console.log(
          "SubscriptionProvider: keeping previous subscription due to fetch error (grace period)",
          previous
        );
        // keep previous in Redux (no dispatch to clear)
      } else {
        console.log(
          "SubscriptionProvider: no previous subscription, clearing state"
        );
        dispatch(updateSubscriptionAction(null as any));
      }
    } finally {
      setIsLoading(false);
      inFlightRef.current = false;
    }
  };

  useEffect(() => {
    refreshSubscription();
  }, [user?.id, user?.profile?.role, isAuthenticated]);

  const currentPlan = useMemo(() => subscription?.plan || null, [subscription]);

  const hasActiveSubscription = useMemo(
    () => subscription?.status === "active",
    [subscription]
  );

  const canAccessPremiumFeatures = useMemo(() => {
    console.log("Checking premium access for user:", user?.profile);
    if (user?.profile?.role === "admin") return true; // Admins always have access
    if (!subscription) return false;

    // Check if subscription is active
    if (subscription.status !== "active") {
      return false;
    }

    // Check if subscription hasn't expired
    if (subscription.end_date && new Date(subscription.end_date) < new Date()) {
      return false;
    }

    return true;
  }, [user?.profile?.role, subscription]);

  const value: SubscriptionContextType = {
    subscription,
    currentPlan,
    isLoading,
    hasActiveSubscription,
    canAccessPremiumFeatures,
    refreshSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
};

// Custom hooks for common subscription checks
export const useCanAccessPremium = (): boolean => {
  const { canAccessPremiumFeatures } = useSubscription();
  return canAccessPremiumFeatures;
};

export const useCurrentPlan = (): Plan | null => {
  const { currentPlan } = useSubscription();
  return currentPlan;
};
