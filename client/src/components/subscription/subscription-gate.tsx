import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Crown, Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { useSubscription } from "@/context/subscription-context";

interface SubscriptionGateProps {
  children: React.ReactNode;
  feature: string;
  description?: string;
  showUpgrade?: boolean;
  fallback?: React.ReactNode;
}

export const SubscriptionGate: React.FC<SubscriptionGateProps> = ({
  children,
  feature,
  description,
  showUpgrade = true,
  fallback,
}) => {
  const { user } = useAuth();
  const { canAccessPremiumFeatures, currentPlan } = useSubscription();
  const navigate = useNavigate();

  // Admin users always have access
  if (user?.role === "admin") {
    return <>{children}</>;
  }

  // If user has access, show the content
  if (canAccessPremiumFeatures) {
    return <>{children}</>;
  }

  // If a custom fallback is provided, use it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default upgrade prompt
  return (
    <Card className="border-dashed border-2 border-amber-200 bg-amber-50/50">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="p-3 bg-amber-100 rounded-full">
            <Crown className="h-8 w-8 text-amber-600" />
          </div>
        </div>
        <CardTitle className="text-xl">Premium Feature</CardTitle>
        <CardDescription>
          {description || `${feature} is available for subscribers only`}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Current plan:{" "}
            <span className="font-medium">{currentPlan?.name || "Free"}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Upgrade to access {feature} and more premium features
          </p>
        </div>

        {showUpgrade && (
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button onClick={() => navigate("/pricing")}>
              <Crown className="h-4 w-4 mr-2" />
              Upgrade Now
            </Button>
            <Button variant="outline" onClick={() => navigate("/pricing")}>
              View Plans
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface FeatureLimitProps {
  current: number;
  limit: number;
  feature: string;
  unit?: string;
}

export const FeatureLimit: React.FC<FeatureLimitProps> = ({
  current,
  limit,
  feature,
  unit = "items",
}) => {
  const { canAccessPremiumFeatures } = useSubscription();
  const navigate = useNavigate();

  const percentage = (current / limit) * 100;
  const isNearLimit = percentage >= 80;
  const isAtLimit = current >= limit;

  if (canAccessPremiumFeatures) {
    return null; // No limits for premium users
  }

  return (
    <Alert
      className={`${
        isAtLimit
          ? "border-red-200 bg-red-50"
          : isNearLimit
          ? "border-yellow-200 bg-yellow-50"
          : "border-blue-200 bg-blue-50"
      }`}>
      <Lock className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <span className="font-medium">{feature} usage: </span>
          {current} / {limit} {unit}
          {isAtLimit && " (Limit reached)"}
        </div>
        {(isNearLimit || isAtLimit) && (
          <Button
            size="sm"
            variant={isAtLimit ? "default" : "outline"}
            onClick={() => navigate("/pricing")}>
            Upgrade
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};
