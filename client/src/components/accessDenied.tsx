import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

interface Plan {
  name: string;
}

export default function AccessDenied() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait until auth session is loaded
    if (authLoading) return;

    if (!user) {
      console.log("No authenticated user, redirecting to sign in...");
      setLocation("/signin");
      return;
    }

    const fetchCurrentPlan = async () => {
      setLoading(true);
      console.log("Fetching subscription for user:", user.id);

      const { data, error } = await supabase
        .from("subscriptions")
        .select(`status, plan:plans(name)`)
        .eq("user_id", user.id)
        .eq("status", "active")
        .single<{ plan: { name: string } | null }>();

      if (error) {
        console.error("Error fetching subscription:", error.message);
        setCurrentPlan(null);
      } else {
        setCurrentPlan(data?.plan ?? null);
        console.log("Fetched active plan:", data?.plan);
      }

      setLoading(false);
    };

    fetchCurrentPlan();
  }, [user, authLoading, setLocation]);

  const handleUpgrade = () => {
    // Redirect to billing/upgrade page
    setLocation("/dashboard/admin/billing");
  };

  const handleBack = () => {
    // Back to dashboard
    setLocation("/dashboard/reports/company");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-black p-6">
      <Card className="max-w-md w-full p-8 text-center bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-white">Access Restricted</h1>
        <p className="text-gray-300 mb-6">
          This feature is not available for your current plan.
        </p>

        {loading ? (
          <p className="text-gray-400">Loading your current plan...</p>
        ) : currentPlan ? (
          <div className="mb-6">
            <p className="text-gray-300">Your current plan:</p>
            <p className="text-white font-semibold text-lg">{currentPlan.name}</p>
          </div>
        ) : (
          <div className="mb-6">
            <p className="text-gray-400">You currently have no active plan.</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleUpgrade} className="btn-gradient w-full sm:w-auto">
            Upgrade Plan
          </Button>
          <Button variant="ghost" onClick={handleBack} className="w-full sm:w-auto">
            Back to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}
