import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Crown,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { SubscriptionService } from "@/services/subscriptionService";
import type { Subscription, Payment } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const SubscriptionPage: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
      return;
    }
    loadSubscriptionData();
  }, [user, navigate]);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      const [subscriptionData, paymentsData] = await Promise.all([
        SubscriptionService.getCurrentSubscription(),
        SubscriptionService.getPaymentHistory(),
      ]);

      setSubscription(subscriptionData);
      setPayments(paymentsData);
    } catch (error) {
      console.error("Error loading subscription data:", error);
      toast({
        title: "Error",
        description: "Failed to load subscription information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    try {
      setCancelling(true);
      await SubscriptionService.cancelSubscription();

      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled successfully",
      });

      await loadSubscriptionData();
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast({
        title: "Cancellation Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to cancel subscription",
        variant: "destructive",
      });
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "canceled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case "past_due":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Past Due</Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case "refunded":
        return <Badge className="bg-gray-100 text-gray-800">Refunded</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg">Loading subscription information...</div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>No Active Subscription</CardTitle>
            <CardDescription>
              You don't have an active subscription. Subscribe to a plan to
              access premium features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/pricing")}>View Plans</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Subscription Management</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Crown className="h-5 w-5 mr-2" />
                Current Plan
              </CardTitle>
              {getStatusBadge(subscription.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">
                {subscription.plan?.name}
              </h3>
              <p className="text-2xl font-bold">
                {formatCurrency(subscription.plan?.price || 0)}
                <span className="text-sm font-normal text-muted-foreground">
                  /month
                </span>
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <CalendarDays className="h-4 w-4 mr-2" />
                Started: {formatDate(subscription.start_date)}
              </div>

              {subscription.end_date && (
                <div className="flex items-center text-sm">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  {subscription.status === "canceled"
                    ? "Access until"
                    : "Renewal"}
                  : {formatDate(subscription.end_date)}
                </div>
              )}
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Plan Features:</h4>
              <ul className="space-y-1">
                {subscription.plan?.features.map((feature, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/pricing")}>
              View All Plans
            </Button>

            {subscription.status === "active" && (
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleCancelSubscription}
                disabled={cancelling}>
                {cancelling ? "Cancelling..." : "Cancel Subscription"}
              </Button>
            )}

            {subscription.status === "canceled" && (
              <Alert>
                <AlertDescription>
                  Your subscription is cancelled but you still have access until{" "}
                  {formatDate(subscription.end_date!)}.
                </AlertDescription>
              </Alert>
            )}

            <div className="text-sm text-muted-foreground">
              <p>
                Need help?{" "}
                <Button variant="link" className="p-0">
                  Contact support
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      {payments.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">
                        {formatCurrency(payment.amount, payment.currency)}
                      </span>
                      {getPaymentStatusBadge(payment.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(payment.created_at)}
                      {payment.payment_method && ` • ${payment.payment_method}`}
                    </p>
                  </div>
                  {payment.transaction_id && (
                    <div className="text-sm text-muted-foreground">
                      ID: {payment.transaction_id}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SubscriptionPage;
