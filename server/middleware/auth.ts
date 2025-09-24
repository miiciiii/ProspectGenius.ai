import { Request, Response, NextFunction } from "express";
import { supabase } from "../supabaseClient";
import type { AuthUser, Profile } from "@shared/schema";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

/**
 * Middleware to verify Supabase JWT tokens
 */
export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    // Verify the JWT token with Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      // PGRST116 = not found
      console.error("Error fetching user profile:", profileError);
      return res.status(500).json({ message: "Failed to fetch user profile" });
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email!,
      profile: (profile as Profile) || undefined,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
}

/**
 * Middleware to require specific roles
 */
export function requireRole(...roles: ("admin" | "subscriber" | "guest")[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.profile) {
      return res.status(403).json({ message: "Profile required" });
    }

    if (!roles.includes(req.user.profile.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(
          " or "
        )}, but you have: ${req.user.profile.role}`,
      });
    }

    next();
  };
}

/**
 * Middleware to require admin role
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  return requireRole("admin")(req, res, next);
}

/**
 * Middleware to require subscriber or admin role (premium features)
 */
export function requireSubscriber(
  req: Request,
  res: Response,
  next: NextFunction
) {
  return requireRole("admin", "subscriber")(req, res, next);
}

/**
 * Middleware for optional authentication (doesn't fail if no token)
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return next();
    }

    // Verify the JWT token with Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (!error && user) {
      // Fetch user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      req.user = {
        id: user.id,
        email: user.email!,
        profile: (profile as Profile) || undefined,
      };
    }

    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
}

/**
 * Middleware to check if user has an active subscription
 */
export async function requireActiveSubscription(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Admins bypass subscription checks
    if (req.user.profile?.role === "admin") {
      return next();
    }

    // Check for active subscription
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("*, plan:plans(*)")
      .eq("user_id", req.user.id)
      .eq("status", "active")
      .single();

    if (error || !subscription) {
      return res.status(403).json({
        message: "Active subscription required. Please upgrade your plan.",
      });
    }

    // Check if subscription hasn't expired
    if (subscription.end_date && new Date(subscription.end_date) < new Date()) {
      return res.status(403).json({
        message: "Subscription has expired. Please renew your plan.",
      });
    }

    next();
  } catch (error) {
    console.error("Subscription check error:", error);
    return res.status(500).json({ message: "Failed to verify subscription" });
  }
}
