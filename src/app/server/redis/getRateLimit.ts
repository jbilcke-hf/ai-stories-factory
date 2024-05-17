import { Ratelimit } from "@upstash/ratelimit"

import { redis } from "./redis"

// Create a global ratelimiter for all users, that allows 14 requests per 60 seconds
// 14 is roughly the number of requests that can be handled by the server
/*
const rateLimitGlobal = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(14, "60 s"),
  analytics: true,
  timeout: 1000,
  prefix: "production"
})
*/

// Create a new ratelimiter for anonymous users
export function getRateLimit() {
  const rateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(1, "1 m"), // 1 request every minute
    analytics: true,
    // timeout: 120000,
    prefix: "production:anon"
  })

  return rateLimit
}
