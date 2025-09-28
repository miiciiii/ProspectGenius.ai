import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "50 company lookups per month",
    features: [
      "CSV Export (limited)",
      "Basic filters (sector, stage, geography)",
      "Weekly digest email",
      "Default Plan",
    ],
    buttonText: "Discover with no Cost",
    highlighted: false,
    current: false,
  },
  {
    name: "Starter",
    price: "$99",
    period: "/month",
    description: "Unlimited company lookups",
    features: [
      "CSV export enabled",
      "Smart filters (sector, stage, geography)",
      "Daily funding alerts",
      "1 active user seat",
      "100 credits per user/month (1,000 tokens)",
    ],
    buttonText: "Subscribe to Starter",
    highlighted: true,
    current: false,
  },
  {
    name: "Professional",
    price: "$199",
    period: "/month",
    description: "Unlimited company lookups",
    features: [
      "Smart filters + advanced scoring",
      "CSV export",
      "Real-time funding alerts (email, Telegram, WhatsApp)",
      "3 active user seats included",
      "Referral credits bonus",
      "500 credits per user/month (1,500 tokens)",
    ],
    buttonText: "Subscribe to Professional",
    highlighted: true,
    current: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 relative bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Choose Your Plan</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-12">
          Select the perfect plan for your business needs. Upgrade or downgrade at any time.
        </p>
        <p className="text-sm text-purple-400 mb-16">Current Plan: Professional</p>

        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 border transition-all duration-300 ${
                plan.highlighted
                  ? "bg-white/10 border-purple-500/50 shadow-lg backdrop-blur-lg"
                  : "bg-white/5 border-white/10 backdrop-blur-md"
              }`}
            >
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <div className="flex items-baseline justify-center gap-1 mb-6">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className="text-gray-400">{plan.period}</span>
              </div>
              <p className="text-gray-300 mb-6">{plan.description}</p>

              <ul className="space-y-3 text-left mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.current
                    ? "btn-gradient cursor-default"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
                disabled={plan.current}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
