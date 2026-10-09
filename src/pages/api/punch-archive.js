// GET -> { cards: [...], total } every finished punch card, newest
// first, plus the all-time number of holes punched.
//
// cards finished before the archive existed are filled in here the
// first time they're missing, without a date (we only ever stored the
// punch count, so there's no record of when they were finished).

import { redis, hasRedis } from "@/lib/redis";
import { completedCards } from "@/data/punchMotifs";
import { archiveCard, readArchive } from "@/lib/punchArchive";

const COUNT_KEY = "electrocute:punchcard:count";

export default async function handler(req, res) {
  if (!hasRedis()) {
    return res.status(200).json({ cards: [], shared: false });
  }

  const total = Number(await redis("GET", COUNT_KEY)) || 0;
  const done = completedCards(total);

  let cards = await readArchive();
  const saved = new Set(cards.map((c) => c.card));
  const missing = [];
  for (let n = 1; n <= done; n++) {
    if (!saved.has(n)) missing.push(n);
  }

  if (missing.length) {
    await Promise.all(missing.map((n) => archiveCard(n, null)));
    cards = await readArchive();
  }

  return res.status(200).json({ cards, total, shared: true });
}
