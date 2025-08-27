import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});


export const globalLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(2, "15 m"), // 10 requests per 60s
  analytics: true,
});
