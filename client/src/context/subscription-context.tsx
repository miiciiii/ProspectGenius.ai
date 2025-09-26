import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { SubscriptionService } from "@/services/subscriptionService";
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
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated, refreshUser } = useAuth();
  // console.log("SubscriptionProvider - user:", user);

  const refreshSubscription = async () => {
    if (!isAuthenticated || !user) {
      setSubscription(null);
      return;
    }

    try {
      setIsLoading(true);
      const subscriptionData =
        await SubscriptionService.getCurrentSubscription();
      setSubscription(subscriptionData);
    } catch (error) {
      console.error("Error fetching subscription:", error);
      setSubscription(null);
    } finally {
      setIsLoading(false);
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
