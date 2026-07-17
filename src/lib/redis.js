// tiny upstash redis REST helper.
// set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN in your env
// (vercel project settings, or .env.local — see .env.example).
// when they're missing every call returns null and the widgets
// quietly fall back to per-device localStorage, so the site never breaks.

export function hasRedis() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

export async function redis(...command) {
  if (!hasRedis()) return null;
  try {
    const res = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/${command
        .map((part) => encodeURIComponent(part))
        .join("/")}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        },
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.result ?? null;
  } catch {
    return null;
  }
}
