import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Pricing from "@/components/landing/Pricing";
import { motion, AnimatePresence } from "framer-motion";

interface BillingData {
  currentPlan: string;
  billingCycle: string;
  amount: string;
  nextBilling: string;
  features: string[];
}

export default function Billing() {
  const { user } = useAuth();
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPricing, setShowPricing] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchBilling = async () => {
      try {
        const { data: subscription } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (!subscription) {
          setBilling({
            currentPlan: "Free",
            billingCycle: "Monthly",
            amount: "$0.00",
            nextBilling: "N/A",
            features: [],
          });
          setLoading(false);
          return;
        }

        const { data: plan } = await supabase
          .from("plans")
          .select("*")
          .eq("id", subscription.plan_id)
          .single();

        setBilling({
          currentPlan: plan?.name || "Unknown",
          billingCycle: "Monthly",
          amount: plan?.price ? `$${plan.price.toFixed(2)}` : "$0.00",
          nextBilling: subscription.end_date
            ? new Date(subscription.end_date).toLocaleDateString()
            : "N/A",
          features: plan?.features || [],
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching billing:", error);
        setLoading(false);
      }
    };

    fetchBilling();
  }, [user]);

  if (loading) return <p>Loading billing info...</p>;
  if (!billing) return null;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Billing</h1>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" /> Current Plan
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{billing.currentPlan}</div>
                <div className="text-muted-foreground">{billing.billingCycle}</div>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {billing.amount}/mo
              </Badge>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="text-sm text-muted-foreground mb-2">Next billing date</div>
              <div className="font-medium">{billing.nextBilling}</div>
            </div>

            <div className="pt-4 flex gap-4">
              <Button
                variant="outline"
                onClick={() => setShowPricing(true)}
                data-testid="button-change-plan"
              >
                Change Plan
              </Button>
              <Button
                variant="outline"
                onClick={() => console.log("Cancel subscription clicked")}
                data-testid="button-cancel-subscription"
              >
                Cancel Subscription
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Plan Features</h3>
          <div className="space-y-3">
            {billing.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Fullscreen Pricing Modal */}
      <AnimatePresence>
        {showPricing && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="relative w-[95vw] h-[95vh] bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              {/* Close Button inside padding-safe area */}
              <div className="absolute top-0 right-0 p-4 z-50">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white"
                  onClick={() => setShowPricing(false)}
                >
                  ✕
                </Button>
              </div>

              {/* Pricing content fills modal */}
              <div className="flex-1 w-full h-full overflow-auto">
                <Pricing fullscreen />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
