import { NextResponse } from "next/server";
import { HOLDINGS } from "@/lib/holdings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

function withTimeout(ms) {
  try {
    return AbortSignal.timeout(ms);
  } catch {
    return undefined;
  }
}

// Primary source: Yahoo. Gives intraday price and previous close directly.
async function fromYahoo(symbol) {
  for (const host of ["query1", "query2"]) {
    try {
      const url =
        `https://${host}.finance.yahoo.com/v8/finance/chart/` +
        encodeURIComponent(symbol) +
        "?interval=1d&range=5d";
      const res = await fetch(url, {
        headers: { "User-Agent": UA, Accept: "application/json" },
        signal: withTimeout(6000),
        cache: "no-store",
      });
      if (!res.ok) continue;
      const data = await res.json();
      const m = data?.chart?.result?.[0]?.meta;
      const price = m?.regularMarketPrice;
      const prev = m?.chartPreviousClose ?? m?.previousClose;
      if (typeof price === "number" && typeof prev === "number") {
        return { price, prevClose: prev, source: "yahoo" };
      }
    } catch {
      // try next host
    }
  }
  return null;
}

// Fallback source: Stooq daily CSV. Very permissive, no key. Uses the last two
// daily closes for price and previous close.
async function fromStooq(symbol) {
  try {
    const s = symbol.toLowerCase() + ".us";
    const url = `https://stooq.com/q/d/l/?s=${s}&i=d`;
    const res = await fetch(url, {
      headers: { "User-Agent": UA },
      signal: withTimeout(6000),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const text = await res.text();
    const lines = text.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return null;
    const rows = lines
      .slice(1)
      .map((l) => l.split(","))
      .filter((r) => r.length >= 5 && !isNaN(parseFloat(r[4])));
    if (!rows.length) return null;
    const last = rows[rows.length - 1];
    const prevRow = rows.length >= 2 ? rows[rows.length - 2] : last;
    const price = parseFloat(last[4]);
    const prev = parseFloat(prevRow[4]);
    if (isNaN(price) || isNaN(prev)) return null;
    return { price, prevClose: prev, source: "stooq" };
  } catch {
    return null;
  }
}

async function quote(h) {
  const q = (await fromYahoo(h.symbol)) || (await fromStooq(h.symbol));
  if (q) {
    return { symbol: h.symbol, price: q.price, prevClose: q.prevClose, source: q.source, stale: false };
  }
  return { symbol: h.symbol, price: h.base, prevClose: h.base, source: "fallback", stale: true };
}

export async function GET() {
  const results = await Promise.all(HOLDINGS.map(quote));
  const quotes = {};
  for (const q of results) quotes[q.symbol] = q;
  const anyStale = results.some((q) => q.stale);
  return NextResponse.json(
    { asOf: Date.now(), anyStale, quotes },
    { headers: { "Cache-Control": "no-store" } }
  );
}
