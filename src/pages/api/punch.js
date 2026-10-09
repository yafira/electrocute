// the communal punch card. every visitor may punch one hole;
// holes fill the card in carriage order and the fabric below
// knits itself as they land.
// GET  -> { count }  total holes ever punched
// POST -> punches one hole, returns new { count }
//
// when a punch fills the last hole on a card, that card is saved to
// the archive (see /api/punch-archive) with the date it was finished.

import { redis, hasRedis } from "@/lib/redis";
import { resolvePosition, MOTIF_DATA } from "@/data/punchMotifs";
import { archiveCard } from "@/lib/punchArchive";

const KEY = "electrocute:punchcard:count";

export default async function handler(req, res) {
  if (!hasRedis()) {
    return res.status(200).json({ count: null, shared: false });
  }

  if (req.method === "POST") {
    const count = Number(await redis("INCR", KEY)) || 0;

    // did this hole finish the card?
    const { motifIndex, punchedInMotif, cardsDone } = resolvePosition(count);
    const completed = punchedInMotif === MOTIF_DATA[motifIndex].holeCount;
    if (completed) {
      await archiveCard(cardsDone + 1, new Date().toISOString());
    }

    return res.status(200).json({ count, shared: true, completed });
  }

  const count = await redis("GET", KEY);
  return res.status(200).json({ count: Number(count) || 0, shared: true });
}
