// the receipt guestbook on /contact.
// GET  -> { notes: [{ name, note, ts }] } (most recent last, like a receipt prints)
// POST -> { name?, note } appends a note, returns the refreshed list
//
// notes are lightly sanitized and capped; the list is trimmed to the
// last 200 server-side and the client shows the most recent handful.
// if you ever need to remove something, delete entries from the
// electrocute:notes list in the upstash console.

import { redis, hasRedis } from "@/lib/redis";

const KEY = "electrocute:notes";

function clean(value, max) {
  return String(value || "")
    .replace(/[<>]/g, "")
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
    return res.status(200).json({ notes: null, shared: false });
  }

  if (req.method === "POST") {
    const note = clean(req.body?.note, 140);
    const name = clean(req.body?.name, 24) || "anonymous visitor";
    if (!note) {
      return res.status(400).json({ error: "a note needs some words" });
    }
    await redis(
      "RPUSH",
      KEY,
      JSON.stringify({ name, note, ts: Date.now() })
    );
    await redis("LTRIM", KEY, "-200", "-1");
    return res.status(200).json({ notes: await readNotes(), shared: true });
  }

  return res.status(200).json({ notes: await readNotes(), shared: true });
}
