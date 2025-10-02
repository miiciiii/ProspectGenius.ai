import { Router, Request, Response } from "express";
import fetch from "node-fetch";

const router = Router();

router.post("/StripePayment", async (req: Request, res: Response) => {
  try {
    const { userId, planName } = req.body as { userId: string; planName: string };

    if (!userId || !planName) {
      return res.status(400).json({ error: "Missing userId or planName" });
    }

    const n8nWebhookUrl =
      process.env.N8N_WEBHOOK_URL ||
      "https://teamagentgenius.app.n8n.cloud/webhook/98c6f9f1-a4f3-4bc4-a569-b8cf8bb0c69e";

    console.log("Calling n8n webhook:", n8nWebhookUrl, { userId, planName });

    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, planName }),
    });

    const text = await n8nResponse.text();
    console.log("Raw n8n response text:", text);

    let dataArray: any[];
    try {
      dataArray = JSON.parse(text);
    } catch (err) {
      console.error("Failed to parse n8n response as JSON:", err);
      return res.status(500).json({ error: "Invalid JSON from n8n webhook" });
    }

    // Defensive checks
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      console.error("n8n response is empty or not an array:", dataArray);
      return res.status(500).json({ error: "Unexpected n8n webhook response" });
    }

    const session = dataArray[0];
    if (!session.url) {
      console.error("Stripe session URL missing in n8n response:", session);
      return res.status(500).json({ error: "No checkout URL returned from n8n" });
    }

    // Send to frontend as 'checkoutUrl'
    res.status(200).json({ checkoutUrl: session.url });
  } catch (err) {
    console.error("StripePayment route error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
