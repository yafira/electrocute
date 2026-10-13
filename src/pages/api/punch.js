// the communal punch card. every visitor may punch one hole, and they
// pick which one, the way you'd punch a real card by hand. the fabric
// knits from the bottom row up as rows fill in.
// GET  -> { count, card, holes }  all-time total, the card on the
//         machine, and which of its holes are punched
// POST { hole } -> punches that hole; 409 if someone got there first
//
// count still goes up by one per punch, so card numbers, punchi and
// the archive keep working off it. which holes are punched lives in a
// set per card. the card that was half done when this shipped was
// punched in carriage order, so its set gets seeded with those holes.
//
// when a punch fills the last hole on a card, that card is saved to
// the archive (see /api/punch-archive) with the date it was finished.

import { redis, hasRedis } from "@/lib/redis";
import { currentCard, completedCards } from "@/data/punchMotifs";
import { archiveCard } from "@/lib/punchArchive";

const KEY = "electrocute:punchcard:count";
const holesKey = (cardNo) => `electrocute:punchcard:holes:${cardNo}`;

// reads the card on the machine and its punched holes
async function readState() {
  const count = Number(await redis("GET", KEY)) || 0;
  const card = currentCard(count);
  let members = (await redis("SMEMBERS", holesKey(card.cardNo))) || [];

  // older card, punched in carriage order before holes were tracked
  if (members.length === 0 && card.punchedBefore > 0) {
    const legacy = Array.from({ length: card.punchedBefore }, (_, i) =>
      String(i),
    );
    await redis("SADD", holesKey(card.cardNo), ...legacy);
    members = legacy;
  }

  return { count, card, holes: members.map(Number).sort((a, b) => a - b) };
}

export default async function handler(req, res) {
  if (!hasRedis()) {
    return res.status(200).json({ count: null, shared: false });
  }

  if (req.method === "POST") {
    const { count, card } = await readState();
    const hole = Number(req.body?.hole);
    if (!Number.isInteger(hole) || hole < 0 || hole >= card.holeCount) {
      return res.status(400).json({ error: "not a hole on this card" });
    }

    // SADD only adds once, so two people can't land the same hole.
    // a full card has every hole in its set, so a punch aimed at a
    // card that just came off the machine bounces here too.
    const added = Number(await redis("SADD", holesKey(card.cardNo), String(hole)));
    if (added !== 1) {
      const fresh = await readState();
      return res.status(409).json({
        taken: true,
        shared: true,
        count: fresh.count,
        card: fresh.card.cardNo,
        holes: fresh.holes,
      });
    }

    const newCount = Number(await redis("INCR", KEY)) || count + 1;
    const members = (await redis("SMEMBERS", holesKey(card.cardNo))) || [];
    const holes = members.map(Number).sort((a, b) => a - b);

    // did this hole finish the card?
    const completed =
      holes.length >= card.holeCount && completedCards(newCount) >= card.cardNo;
    if (completed) {
      await archiveCard(card.cardNo, new Date().toISOString());
    }

    return res.status(200).json({
      count: newCount,
      shared: true,
      card: card.cardNo,
      holes,
      completed,
    });
  }

  const { count, card, holes } = await readState();
  return res
    .status(200)
    .json({ count, shared: true, card: card.cardNo, holes });
}
