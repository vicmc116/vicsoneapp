import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const handler = async (event) => {
  try {
    let body = {};

    // SAFE JSON PARSING (handles Netlify + AutoIt inconsistencies)
    try {
      body = event.body ? JSON.parse(event.body) : {};
    } catch (e) {
      body = {};
    }

    const email = body.email;

    if (!email) {
      return {
        statusCode: 400,
        body: "MISSING_EMAIL"
      };
    }

    const user = email.toLowerCase().trim();

    await redis.set(`last_seen:${user}`, Date.now());

    return {
      statusCode: 200,
      body: "OK"
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: "ERROR"
    };
  }
};