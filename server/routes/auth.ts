import { Router } from "express";
import {
  authenticateToken,
  requireAdmin,
  optionalAuth,
} from "../middleware/auth";
import { ProfileService } from "../services/profileService";

const router = Router();

/**
 * Get current user profile
 * GET /api/auth/profile
 */
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const profile = await ProfileService.getProfile(req.user.id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        profile,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      message: "Failed to fetch profile",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * Update current user profile
 * PATCH /api/auth/profile
 */
router.patch("/profile", authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { full_name } = req.body;

    // Users can only update their own profile and not their role
    const updatedProfile = await ProfileService.updateProfile(req.user.id, {
      full_name,
    });

    res.json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      message: "Failed to update profile",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * Get all profiles (admin only)
 * GET /api/auth/profiles
 */
router.get("/profiles", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const profiles = await ProfileService.getAllProfiles();
    res.json(profiles);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({
      message: "Failed to fetch profiles",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * Update user role (admin only)
 * PATCH /api/auth/profiles/:userId/role
 */
router.patch(
  "/profiles/:userId/role",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!["admin", "subscriber", "guest"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const updatedProfile = await ProfileService.updateRole(userId, role);
      res.json(updatedProfile);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({
        message: "Failed to update user role",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

/**
 * Get profile statistics (admin only)
 * GET /api/auth/stats
 */
router.get("/stats", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await ProfileService.getProfileStats();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching profile stats:", error);
    res.status(500).json({
      message: "Failed to fetch profile stats",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * Delete user profile (admin only)
 * DELETE /api/auth/profiles/:userId
 */
router.delete(
  "/profiles/:userId",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { userId } = req.params;

      // Prevent admin from deleting themselves
      if (userId === req.user?.id) {
        return res
          .status(400)
          .json({ message: "Cannot delete your own profile" });
      }

      await ProfileService.deleteProfile(userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting profile:", error);
      res.status(500).json({
        message: "Failed to delete profile",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

/**
 * Sync profile with auth user data
 * POST /api/auth/sync
 */
router.post("/sync", authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const profile = await ProfileService.syncWithAuthUser(
      req.user.id,
      req.user
    );
    res.json(profile);
  } catch (error) {
    console.error("Error syncing profile:", error);
    res.status(500).json({
      message: "Failed to sync profile",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
