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

    const license = await redis.get(`license:${user}`);
    const start = Number(await redis.get(`trial_start:${user}`));
    const last_seen = await redis.get(`last_seen:${user}`);

    const duration =
      Number(await redis.get(`trial_duration:${user}`)) ||
      (7 * 24 * 60 * 60 * 1000);

    const end = start ? start + duration : null;

    const days_left =
      end ? Math.max(0, Math.ceil((end - Date.now()) / 86400000)) : 0;

    const blocked = await redis.sismember("blocked_emails", user);

return {
  statusCode: 200,
  body: JSON.stringify({
    email: user,
    license: license || "NONE",
    trial_start: start || null,
    trial_end: end || null,
    days_left,
    blocked: Boolean(blocked),
    last_seen
  })
};

  } catch (err) {
    return { statusCode: 500, body: "ERROR" };
  }
};