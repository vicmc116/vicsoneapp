import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export const handler = async () => {
  try {
    const keys = await redis.keys("license:*");

    const users = await Promise.all(
      keys.map(async (k) => {
        const email = k.replace("license:", "");

        const license = await redis.get(`license:${email}`);
        const blocked = await redis.sismember("blocked_emails", email);

        // 🔴 ADD THIS (heartbeat tracking)
        const last_seen = await redis.get(`last_seen:${email}`);

        return {
          email,
          license: license || "TRIAL",
          blocked: Number(blocked) === 1,
          last_seen: last_seen || null
        };
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ users })
    };

  } catch (e) {
    return { statusCode: 500, body: "ERROR" };
  }
};