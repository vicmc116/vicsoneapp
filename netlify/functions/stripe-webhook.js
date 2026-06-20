import Stripe from "stripe";
import { Redis } from "@upstash/redis";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const handler = async (event) => {
  try {

    // =====================================================
    // 🟢 TEST MODE (NO STRIPE SIGNATURE REQUIRED)
    // =====================================================
    if (event.headers["x-test-webhook"] === "true") {
      const body = JSON.parse(event.body || "{}");
      const email = body.email?.toLowerCase().trim();

      await redis.set(`license:${email}`, "PAID");

      await redis.lpush(
        `audit:${email}`,
        JSON.stringify({
          action: "TEST_WEBHOOK",
          time: Date.now(),
        })
      );

      return {
        statusCode: 200,
        body: "TEST WEBHOOK OK",
      };
    }

    // =====================================================
    // 🟡 REAL STRIPE WEBHOOK
    // =====================================================
    const sig = event.headers["stripe-signature"];

    const rawBody = event.body;

    let stripeEvent;

    try {
      stripeEvent = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return {
        statusCode: 400,
        body: `Webhook Error: ${err.message}`,
      };
    }

    // -----------------------------
    // PAYMENT SUCCESS HANDLER
    // -----------------------------
    if (stripeEvent.type === "checkout.session.completed") {
      const session = stripeEvent.data.object;

      const email = session.customer_email?.toLowerCase();

      if (!email) {
        return { statusCode: 200, body: "NO_EMAIL" };
      }

      const user = email.trim();

      const purchase = {
        id: session.id,
        email: user,
        amount_total: session.amount_total,
        currency: session.currency,
        status: "paid",
        created_at: Date.now(),
      };

      await redis.lpush(
        `purchases:${user}`,
        JSON.stringify(purchase)
      );

      await redis.set(`license:${user}`, "PAID");

      await redis.lpush(
        `audit:${user}`,
        JSON.stringify({
          action: "STRIPE_PURCHASE",
          reason: "WEBHOOK",
          time: Date.now(),
        })
      );
    }

    return {
      statusCode: 200,
      body: "OK",
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: err.message,
    };
  }
};