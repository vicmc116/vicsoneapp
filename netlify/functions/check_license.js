import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export const handler = async (event) => {
  try {

    const email = event.queryStringParameters?.email;
    if (!email) return { statusCode: 200, body: "ALLOWED" };

    const user = email.toLowerCase().trim();

    if (await redis.sismember("blocked_emails", user)) {
      return { statusCode: 200, body: "BLOCKED" };
    }

    let license = await redis.get(`license:${user}`);
    if (!license) {
      license = "TRIAL";
      await redis.set(`license:${user}`, license);
    }

    if (license === "PAID") {
      return { statusCode: 200, body: "ALLOWED" };
    }

    let start = await redis.get(`trial_start:${user}`);
    if (!start) {
      start = Date.now();
      await redis.set(`trial_start:${user}`, start);
    }

    const duration =
      Number(await redis.get(`trial_duration:${user}`)) ||
      (7 * 24 * 60 * 60 * 1000);

    const end = Number(start) + duration;

    if (Date.now() > end) {
      await redis.sadd("blocked_emails", user);
      return { statusCode: 200, body: "BLOCKED" };
    }

    return { statusCode: 200, body: "ALLOWED" };

  } catch (err) {
    return { statusCode: 200, body: "ALLOWED" };
  }
};