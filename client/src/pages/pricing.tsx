import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Star, Crown, Users } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { SubscriptionService } from "@/services/subscriptionService";
import type { Plan, Subscription } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const PricingPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentSubscription, setCurrentSubscription] =
    useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [plansData, subscriptionData] = await Promise.all([
        SubscriptionService.getPlans(),
        user
          ? SubscriptionService.getCurrentSubscription().catch(() => null)
          : Promise.resolve(null),
      ]);

      setPlans(plansData);
      setCurrentSubscription(subscriptionData);
    } catch (error) {
      console.error("Error loading pricing data:", error);
      toast({
        title: "Error",
        description: "Failed to load pricing information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to subscribe to a plan",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubscribing(planId);

      await SubscriptionService.subscribe({ plan_id: planId });

      toast({
        title: "Success!",
        description: "You have successfully subscribed to the plan",
      });

      // Refresh user data and subscription info
      await refreshUser();
      await loadData();
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Subscription Failed",
        description:
          error instanceof Error ? error.message : "Failed to subscribe",
        variant: "destructive",
      });
    } finally {
      setSubscribing(null);
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "free":
        return <Users className="h-8 w-8 text-blue-500" />;
      case "starter":
        return <Star className="h-8 w-8 text-green-500" />;
      case "professional":
        return <Crown className="h-8 w-8 text-purple-500" />;
      default:
        return <Users className="h-8 w-8 text-gray-500" />;
    }
  };

  const isCurrentPlan = (planId: string) => {
    return currentSubscription?.plan_id === planId;
  };

  const canSubscribe = (plan: Plan) => {
    if (!user) return false;
    if (isCurrentPlan(plan.id)) return false;
    if (plan.name.toLowerCase() === "free") return false;
    return true;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg">Loading pricing plans...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Select the perfect plan for your business needs. Upgrade or downgrade
          at any time.
        </p>
      </div>

      {currentSubscription && (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-center">
            <p className="text-blue-800">
              Current Plan: <strong>{currentSubscription.plan?.name}</strong>
            </p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${
              isCurrentPlan(plan.id) ? "ring-2 ring-blue-500" : ""
            } ${
              plan.name.toLowerCase() === "professional"
                ? "border-purple-200"
                : ""
            }`}>
            {plan.name.toLowerCase() === "professional" && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-600 text-white">Most Popular</Badge>
              </div>
            )}

            {isCurrentPlan(plan.id) && (
              <div className="absolute -top-4 right-4">
                <Badge variant="default">Current Plan</Badge>
              </div>
            )}

            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {getPlanIcon(plan.name)}
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              {canSubscribe(plan) ? (
                <Button
                  className="w-full"
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={subscribing === plan.id}
                  variant={
                    plan.name.toLowerCase() === "professional"
                      ? "default"
                      : "outline"
                  }>
                  {subscribing === plan.id
                    ? "Subscribing..."
                    : `Subscribe to ${plan.name}`}
                </Button>
              ) : isCurrentPlan(plan.id) ? (
                <Button className="w-full" disabled variant="secondary">
                  Current Plan
                </Button>
              ) : plan.name.toLowerCase() === "free" ? (
                <Button className="w-full" disabled variant="outline">
                  Default Plan
                </Button>
              ) : (
                <Button className="w-full" disabled variant="outline">
                  Contact Sales
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
          <span className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" />
            Cancel anytime
          </span>
          <span className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" />
            24/7 support
          </span>
          <span className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" />
            Secure payments
          </span>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
