import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface UserAccess {
  role: string;
  plan: string;
  loading: boolean;
}

export function useUserAccess(user: User | null, authLoading: boolean): UserAccess {
  const [role, setRole] = useState<string>("guest");
  const [plan, setPlan] = useState<string>("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return; // wait until auth finishes
    }

    if (!user) {
      setRole("guest");
      setPlan("free");
      setLoading(false);
      return;
    }

    let mounted = true;

    const fetchAccess = async () => {
      try {
        setLoading(true);

        // --- Fetch role from profiles ---
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        const newRole = profile?.role?.toLowerCase() ?? "guest";

        // --- Fetch active subscription ---
        const { data: subscription, error: subscriptionError } = await supabase
          .from("subscriptions")
          .select("plan_id")
          .eq("user_id", user.id)
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (subscriptionError) throw subscriptionError;

        let newPlan = "free";
        if (subscription?.plan_id) {
          const { data: planData, error: planError } = await supabase
            .from("plans")
            .select("name")
            .eq("id", subscription.plan_id)
            .single();

          if (planError) throw planError;
          newPlan = planData?.name?.toLowerCase() ?? "free";
        }

        if (!mounted) return;
        setRole(newRole);
        setPlan(newPlan);
      } catch (err) {
        console.error("useUserAccess error:", err);
        if (!mounted) return;
        setRole("guest");
        setPlan("free");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAccess();

    return () => {
      mounted = false;
    };
  }, [user, authLoading]);

  return { role, plan, loading };
}
