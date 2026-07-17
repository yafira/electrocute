// the communal punch card. every visitor may punch one hole;
// holes fill the card in carriage order and the fabric below
// knits itself as they land.
// GET  -> { count }  total holes ever punched
// POST -> punches one hole, returns new { count }

import { redis, hasRedis } from "@/lib/redis";

const KEY = "electrocute:punchcard:count";

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
