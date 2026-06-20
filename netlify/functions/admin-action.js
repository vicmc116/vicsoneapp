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
    const body = JSON.parse(event.body || "{}");
    const { email, action, days } = body;

    if (!email || !action) {
      return { statusCode: 400, body: "MISSING_DATA" };
    }

    const user = email.toLowerCase().trim();

    if (action === "upgrade") {
      await redis.set(`license:${user}`, "PAID");
      await logAudit(user, "UPGRADE", "MANUAL_ADMIN");
    }

    if (action === "reset_trial") {
      await redis.del(`trial_start:${user}`);
      await logAudit(user, "RESET_TRIAL", "MANUAL_ADMIN");
    }

    if (action === "block") {
      await redis.sadd("blocked_emails", user);
      await logAudit(user, "BLOCK", "MANUAL_ADMIN");
    }

    if (action === "unblock") {
      await redis.srem("blocked_emails", user);
      await logAudit(user, "UNBLOCK", "MANUAL_ADMIN");
    }

    if (action === "delete") {
      await redis.del(`license:${user}`);
      await redis.del(`trial_start:${user}`);
      await redis.del(`trial_duration:${user}`);
      await redis.del(`geo:${user}`);
      await redis.srem("blocked_emails", user);

      await logAudit(user, "DELETE", "MANUAL_ADMIN");
    }

    if (action === "adjust_trial_days") {
      const change = Number(days);
      if (isNaN(change)) return { statusCode: 400, body: "INVALID_DAYS" };

      const key = `trial_duration:${user}`;

      const current =
        Number(await redis.get(key)) ||
        (7 * 24 * 60 * 60 * 1000);

      const updated = current + (change * 24 * 60 * 60 * 1000);

      await redis.set(key, Math.max(0, updated));

      await logAudit(user, "ADJUST_TRIAL", "MANUAL_ADMIN");

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, updated })
      };
    }

    return { statusCode: 200, body: "OK" };

  } catch (err) {
    return { statusCode: 500, body: "ERROR" };
  }
};