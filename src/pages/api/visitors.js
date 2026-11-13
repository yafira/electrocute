// the visitor counter in the menu bar.
// GET  -> { count } (null when no redis is configured)
// POST -> counts one new visitor and returns their number

import { redis, hasRedis } from "@/lib/redis";

const KEY = "electrocute:visitors:count";

export default async function handler(req, res) {
  if (!hasRedis()) {
    return res.status(200).json({ count: null });
  }

  if (req.method === "POST") {
    const count = await redis("INCR", KEY);
    return res.status(200).json({ count: Number(count) || null });
  }

  const count = await redis("GET", KEY);
  return res.status(200).json({ count: Number(count) || null });
}
