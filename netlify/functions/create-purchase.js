import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");

    const {
      email,
      name,
      product_id,
      product_name,
      amount,
      currency,
      ip
    } = body;

    if (!email || !product_id || !product_name) {
      return {
        statusCode: 400,
        body: "MISSING_REQUIRED_FIELDS"
      };
    }

    const purchase = {
      id: crypto.randomUUID(),

      // identity
      email: email.toLowerCase().trim(),
      name: name || "",

      // product
      product_id,
      product_name,

      // payment (Stripe-ready)
      amount: amount || 0,
      currency: currency || "USD",
      status: "paid",

      // tracking
      ip: ip || null,
      user_agent: event.headers["user-agent"] || null,

      // Stripe placeholders
      stripe_session_id: null,
      stripe_payment_intent: null,

      // timestamps
      created_at: Date.now(),
      updated_at: Date.now()
    };

    /* =========================
       🔴 REDIS STORAGE (ADDED)
       ========================= */

    await redis.set(`purchase:${purchase.id}`, JSON.stringify(purchase));
    await redis.lpush("purchases", purchase.id);
    await redis.lpush(`purchases:${purchase.email}`, purchase.id);

    console.log("PURCHASE_CREATED:", purchase);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        purchase
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: "ERROR"
    };
  }
};