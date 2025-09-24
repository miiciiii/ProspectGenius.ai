import { Router } from "express";
import { authenticateToken, requireAdmin } from "../middleware/auth";
import { SubscriptionService } from "../services/subscriptionService";

const router = Router();

/**
 * Get current user's subscription
 * GET /api/subscription
 */
router.get("/", authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const subscription = await SubscriptionService.getUserSubscription(
      req.user.id
    );

    if (!subscription) {
      return res.status(404).json({ message: "No subscription found" });
    }

    res.json(subscription);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    res.status(500).json({
      message: "Failed to fetch subscription",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * Subscribe user to a plan
 * POST /api/subscription/subscribe
 */
router.post("/subscribe", authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { plan_id, payment_method } = req.body;

    if (!plan_id) {
      return res.status(400).json({ message: "Plan ID is required" });
    }

    // Verify plan exists
    const plan = await SubscriptionService.getPlan(plan_id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // For now, we'll create an active subscription
    // In a real implementation, you'd integrate with Stripe/PayPal here
    const subscription = await SubscriptionService.subscribeUser(
      req.user.id,
      plan_id,
      {}
    );

    // In a real implementation, you'd return a payment URL or handle payment here
    res.status(201).json({
      subscription,
      message: "Subscription created successfully",
      // payment_url: 'https://checkout.stripe.com/...' // For external payment processing
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({
      message: "Failed to create subscription",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * Cancel current subscription
 * POST /api/subscription/cancel
 */
router.post("/cancel", authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const subscription = await SubscriptionService.cancelSubscription(
      req.user.id
    );
    res.json({
      subscription,
      message: "Subscription canceled successfully",
    });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    res.status(500).json({
      message: "Failed to cancel subscription",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * Get user's payment history
 * GET /api/subscription/payments
 */
router.get("/payments", authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const payments = await SubscriptionService.getUserPayments(req.user.id);
    res.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({
      message: "Failed to fetch payments",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * Check subscription status
 * GET /api/subscription/status
 */
router.get("/status", authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const isActive = await SubscriptionService.isSubscriptionActive(
      req.user.id
    );
    res.json({ is_active: isActive });
  } catch (error) {
    console.error("Error checking subscription status:", error);
    res.status(500).json({
      message: "Failed to check subscription status",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * Get all subscriptions (admin only)
 * GET /api/subscription/all
 */
router.get("/all", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const subscriptions = await SubscriptionService.getAllSubscriptions();
    res.json(subscriptions);
  } catch (error) {
    console.error("Error fetching all subscriptions:", error);
    res.status(500).json({
      message: "Failed to fetch subscriptions",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * Record a payment (admin only - for manual payment recording)
 * POST /api/subscription/payments
 */
router.post("/payments", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      subscription_id,
      amount,
      currency = "USD",
      status,
      transaction_id,
      payment_method,
    } = req.body;

    if (!subscription_id || !amount || !status) {
      return res
        .status(400)
        .json({ message: "Subscription ID, amount, and status are required" });
    }

    const payment = await SubscriptionService.recordPayment({
      subscription_id,
      amount: parseFloat(amount),
      currency,
      status,
      transaction_id,
      payment_method,
      processed_at: status === "completed" ? new Date().toISOString() : null,
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error("Error recording payment:", error);
    res.status(500).json({
      message: "Failed to record payment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
