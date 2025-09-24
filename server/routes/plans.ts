import { Router } from "express";
import {
  authenticateToken,
  requireAdmin,
  requireSubscriber,
} from "../middleware/auth";
import { SubscriptionService } from "../services/subscriptionService";

const router = Router();

/**
 * Get all available plans
 * GET /api/plans
 */
router.get("/", async (req, res) => {
  try {
    const plans = await SubscriptionService.getPlans();
    res.json(plans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    res.status(500).json({
      message: "Failed to fetch plans",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * Get plan by ID
 * GET /api/plans/:planId
 */
router.get("/:planId", async (req, res) => {
  try {
    const { planId } = req.params;
    const plan = await SubscriptionService.getPlan(planId);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.json(plan);
  } catch (error) {
    console.error("Error fetching plan:", error);
    res.status(500).json({
      message: "Failed to fetch plan",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * Create new plan (admin only)
 * POST /api/plans
 */
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, price, features, is_active = true } = req.body;

    if (!name || price === undefined || !features) {
      return res
        .status(400)
        .json({ message: "Name, price, and features are required" });
    }

    const plan = await SubscriptionService.createPlan({
      name,
      price: parseFloat(price),
      features: Array.isArray(features) ? features : [],
      is_active,
    });

    res.status(201).json(plan);
  } catch (error) {
    console.error("Error creating plan:", error);
    res.status(500).json({
      message: "Failed to create plan",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * Update plan (admin only)
 * PATCH /api/plans/:planId
 */
router.patch("/:planId", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { planId } = req.params;
    const updates = req.body;

    // Convert price to number if provided
    if (updates.price !== undefined) {
      updates.price = parseFloat(updates.price);
    }

    const plan = await SubscriptionService.updatePlan(planId, updates);
    res.json(plan);
  } catch (error) {
    console.error("Error updating plan:", error);
    res.status(500).json({
      message: "Failed to update plan",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
