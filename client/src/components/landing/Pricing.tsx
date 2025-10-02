import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { FaDatabase, FaFileCsv, FaFilter, FaEnvelope, FaUser, FaBell, FaUsers, FaGift } from "react-icons/fa";
import { useState } from "react";

interface PricingProps {
  fullscreen?: boolean;
}

interface PlanFeature {
  icon: JSX.Element;
  text: string;
}

interface Plan {
  name: string;
  price: string;
  period: string;
  features: PlanFeature[];
  highlight?: string | null;
  cta: string;
  variant: "outline" | "gradient" | "default";
}

interface StripePaymentResponse {
  checkoutUrl?: string;
  error?: string;
}

export default function Pricing({ fullscreen = false }: PricingProps) {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const plans: Plan[] = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      features: [
        { icon: <FaDatabase />, text: "50 company lookups per month" },
        { icon: <FaFileCsv />, text: "CSV Export (limited)" },
        { icon: <FaFilter />, text: "Basic filters (sector, stage, geography)" },
        { icon: <FaEnvelope />, text: "Weekly digest email" },
      ],
      highlight: "Default Plan",
      cta: "Discover with no Cost",
      variant: "outline",
    },
    {
      name: "Starter",
      price: "$99",
      period: "/month",
      features: [
        { icon: <FaDatabase />, text: "Unlimited company lookups" },
        { icon: <FaFileCsv />, text: "CSV export enabled" },
        { icon: <FaFilter />, text: "Smart filters (sector, stage, geography)" },
        { icon: <FaBell />, text: "Daily funding alerts" },
        { icon: <FaUser />, text: "1 active user seat" },
        { icon: <FaGift />, text: "100 credits per user/month (1,000 tokens)" },
      ],
      highlight: "Most Popular",
      cta: "Subscribe to Starter",
      variant: "gradient",
    },
    {
      name: "Professional",
      price: "$199",
      period: "/month",
      features: [
        { icon: <FaDatabase />, text: "Unlimited company lookups" },
        { icon: <FaFilter />, text: "Smart filters + advanced scoring" },
        { icon: <FaFileCsv />, text: "CSV export" },
        { icon: <FaBell />, text: "Real-time funding alerts (email, Telegram, WhatsApp)" },
        { icon: <FaUsers />, text: "3 active user seats included" },
        { icon: <FaGift />, text: "Referral credits bonus" },
        { icon: <FaGift />, text: "500 credits per user/month (1,500 tokens)" },
      ],
      highlight: null,
      cta: "Get Professional",
      variant: "default",
    },
  ];

  const handleSelectPlan = async (planName: string) => {
    if (!user) {
      setLocation("/signin");
      return;
    }

    setLoadingPlan(planName);

    try {
      const response = await fetch("/api/StripePayment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, planName }),
      });

      console.log("StripePayment API raw response:", response);

      if (!response.ok) {
        console.error("StripePayment API returned non-OK status:", response.status);
        throw new Error(`API error: ${response.status}`);
      }

      const text = await response.text();
      console.log("StripePayment raw text:", text);

      let parsed: StripePaymentResponse;
      try {
        parsed = JSON.parse(text);
      } catch (err) {
        console.error("Failed to parse StripePayment JSON:", err);
        throw new Error("Invalid JSON from StripePayment API");
      }

      const checkoutUrl = parsed.checkoutUrl;
      console.log("Parsed checkout URL:", checkoutUrl);

      if (!checkoutUrl) {
        throw new Error("No checkout URL returned from API");
      }

      console.log("Redirecting to checkout URL:", checkoutUrl);
      window.location.href = checkoutUrl;

    } catch (err) {
      console.error("Error creating checkout session:", err);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section
      id="pricing"
      className={`relative flex flex-col items-center justify-start bg-gradient-to-br from-gray-900 via-indigo-900 to-black
        ${fullscreen ? "w-full h-full p-6" : "min-h-screen py-24 sm:py-32"}`}
    >
      {!fullscreen && (
        <>
          <div className="absolute inset-0 bg-black/40 z-0" />
          <div className="absolute top-20 left-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-16 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </>
      )}

      <div className="relative z-10 w-full max-w-7xl flex flex-col items-center">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-white">Choose Your Plan</h2>
          <p className="mt-2 text-lg text-gray-300 max-w-3xl mx-auto">
            Select the perfect plan for your business needs. Upgrade or downgrade at any time.
          </p>
        </div>

        <div
          className={`grid gap-10 sm:grid-cols-2 lg:grid-cols-3 w-full mt-16 overflow-visible ${
            fullscreen ? "h-full overflow-auto pr-2" : ""
          }`}
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative overflow-visible flex flex-col rounded-2xl shadow-xl transition hover:shadow-2xl ${
                plan.name === "Starter" ? "ring-2 ring-primary" : "border border-white/10"
              } bg-white/5 backdrop-blur-md`}
            >
              {plan.highlight && (
                <span className="absolute left-1/2 -translate-x-1/2 -top-4 px-4 py-1.5 text-sm font-semibold rounded-full shadow-md text-white bg-primary">
                  {plan.highlight}
                </span>
              )}

              <div className="p-6 pt-8 flex-1 flex flex-col items-center justify-center text-center">
                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>

                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-gray-300">{plan.period}</span>
                </div>

                <ul className="mt-6 space-y-2 text-sm text-gray-300">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 justify-center">
                      <span className="text-primary">{feature.icon}</span>
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto w-full pt-4">
                  <Button
                    disabled={loadingPlan === plan.name}
                    className={`w-full ${
                      plan.variant === "gradient"
                        ? "btn-gradient"
                        : plan.variant === "outline"
                        ? "border border-white/30 text-white"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                    onClick={() => handleSelectPlan(plan.name)}
                  >
                    {loadingPlan === plan.name ? "Redirecting..." : plan.cta}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
