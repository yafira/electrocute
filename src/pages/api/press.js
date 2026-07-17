// the felt button's shared press counter.
// GET  -> { count } (null when no redis is configured)
// POST -> increments and returns the new { count }

import { redis, hasRedis } from "@/lib/redis";

const KEY = "electrocute:press:count";

export default async function handler(req, res) {
  if (!hasRedis()) {
    return res.status(200).json({ count: null, shared: false });
  }

  if (req.method === "POST") {
    const count = await redis("INCR", KEY);
    return res.status(200).json({ count: Number(count) || 0, shared: true });
  }

  const count = await redis("GET", KEY);
  return res.status(200).json({ count: Number(count) || 0, shared: true });
}
