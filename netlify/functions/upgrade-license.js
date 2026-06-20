import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const logAudit = async (user, action, reason) => {
  await redis.lpush(
    `audit:${user}`,
    JSON.stringify({
      action,
      reason,
      time: Date.now()
    })
  );
};

export const handler = async (event) => {
  try {

    const email = event.queryStringParameters?.email;
    if (!email) return { statusCode: 400, body: "MISSING_EMAIL" };

    const user = email.toLowerCase().trim();

    await redis.set(`license:${user}`, "PAID");
    await redis.del(`trial_start:${user}`);
    await redis.srem("blocked_emails", user);

    await logAudit(user, "UPGRADE", "MANUAL_ADMIN");

    return {
      statusCode: 200,
      body: "UPGRADED_TO_PAID"
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: "ERROR"
    };
  }
};