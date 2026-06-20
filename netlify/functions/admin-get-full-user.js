import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const handler = async (event) => {
  try {
    const email = event.queryStringParameters?.email?.toLowerCase().trim();

    if (!email) {
      return {
        statusCode: 400,
        body: "MISSING_EMAIL",
      };
    }

    // -----------------------------
    // KEYS
    // -----------------------------
    const licenseKey = `license:${email}`;
    const purchasesKey = `purchases:${email}`;
    const auditKey = `audit:${email}`;

    // -----------------------------
    // DATA FETCH
    // -----------------------------
    const license = await redis.get(licenseKey);

    const purchasesRaw = await redis.lrange(purchasesKey, 0, -1);
    const auditRaw = await redis.lrange(auditKey, 0, -1);

    const purchases = (purchasesRaw || []).map((p) =>
      typeof p === "string" ? JSON.parse(p) : p
    );

    const audit = (auditRaw || []).map((a) =>
      typeof a === "string" ? JSON.parse(a) : a
    );

    // -----------------------------
    // TOTAL SPENT (simple calc)
    // -----------------------------
    const total_spent = purchases.reduce((sum, p) => {
      return sum + (p.amount_total ? p.amount_total / 100 : 0);
    }, 0);

    // -----------------------------
    // RESPONSE
    // -----------------------------
    return {
      statusCode: 200,
      body: JSON.stringify({
        email,
        license: license || "NONE",
        purchases,
        audit,
        total_spent,
      }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: err.message,
    };
  }
};