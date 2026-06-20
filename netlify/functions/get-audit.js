import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export const handler = async (event) => {
  try {
    const email = event.queryStringParameters?.email;
    if (!email) return { statusCode: 400, body: "MISSING_EMAIL" };

    const user = email.toLowerCase().trim();

    const logs = await redis.lrange(`audit:${user}`, 0, -1);

    const safeLogs = logs.map(l => {
      if (!l) return null;

      // already object (Upstash sometimes returns parsed JSON)
      if (typeof l === "object") return l;

      // string JSON
      try {
        return JSON.parse(l);
      } catch {
        return { action: "RAW", raw: String(l) };
      }
    }).filter(Boolean);

    return {
      statusCode: 200,
      body: JSON.stringify({
        email: user,
        logs: safeLogs
      })
    };

  } catch (err) {
    return { statusCode: 500, body: "ERROR" };
  }
};