// the receipt guestbook on /contact.
// GET  -> { notes: [{ name, note, ts }], shared: true }
// POST -> { name?, note } appends a note, returns refreshed list

import { redis, hasRedis } from "@/lib/redis";

const KEY = "electrocute:notes";

function clean(value, max) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

async function readNotes() {
  const raw = (await redis("LRANGE", KEY, "-200", "-1")) || [];

  return raw
    .map((item) => {
      try {
        return JSON.parse(item);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

export default async function handler(req, res) {
  if (!hasRedis()) {
    return res.status(200).json({
      notes: null,
      shared: false,
    });
  }

  // add a note
  if (req.method === "POST") {
    const note = clean(req.body?.note, 140);
    const name = clean(req.body?.name, 24) || "anonymous visitor";

    if (!note) {
      return res.status(400).json({
        error: "a note needs some words",
      });
    }

    await redis(
      "RPUSH",
      KEY,
      JSON.stringify({
        name,
        note,
        ts: Date.now(),
      }),
    );

    // keep only newest 200 notes
    await redis("LTRIM", KEY, "-200", "-1");

    return res.status(200).json({
      notes: await readNotes(),
      shared: true,
    });
  }

  // load notes
  if (req.method === "GET") {
    return res.status(200).json({
      notes: await readNotes(),
      shared: true,
    });
  }

  return res.status(405).json({
    error: "method not allowed",
  });
}
