// the punch card archive. one entry per finished card, kept in a
// redis hash keyed by card number. each entry saves a copy of the
// motif's rows and yarn colors, so the archive keeps showing exactly
// what was knit even if punchMotifs.js changes later.

import { redis } from "@/lib/redis";
import { motifForCard, yarnForCard } from "@/data/punchMotifs";

export const ARCHIVE_KEY = "electrocute:punchcard:archive";

// saves a finished card. HSETNX only writes if the card isn't there
// yet, so a card can never be saved twice or have its date changed.
export async function archiveCard(cardNo, completedAt) {
  const motif = motifForCard(cardNo);
  const yarn = yarnForCard(cardNo);
  const entry = {
    card: cardNo,
    motif: motif.name,
    rows: motif.rows,
    yarn,
    completedAt,
  };
  return redis("HSETNX", ARCHIVE_KEY, String(cardNo), JSON.stringify(entry));
}

export async function readArchive() {
  const flat = (await redis("HGETALL", ARCHIVE_KEY)) || [];
  const cards = [];
  for (let i = 1; i < flat.length; i += 2) {
    try {
      cards.push(JSON.parse(flat[i]));
    } catch {
      // skip anything that isn't a card
    }
  }
  return cards.sort((a, b) => b.card - a.card);
}
