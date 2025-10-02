import type { Express } from "express";
import { createServer, type Server } from "http";
import stripePaymentRouter from "./StripePayment";

export async function registerRoutes(app: Express): Promise<Server> {
  app.use("/api", stripePaymentRouter); // register /api/StripePayment

  const httpServer = createServer(app);
  return httpServer;
}
