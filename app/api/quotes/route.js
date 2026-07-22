import { NextResponse } from "next/server";
import { HOLDINGS } from "@/lib/holdings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Pull a single symbol from Yahoo's public chart endpoint (no key needed).
// Runs server-side, so there is no CORS problem and no manual entry.
async function fetchQuote(h) {
  const url =
    "https://query1.finance.yahoo.com/v8/finance/chart/" +
    encodeURIComponent(h.symbol) +
    "?interval=1d&range=5d";
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Accept: "application/json",
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("status " + res.status);
    const data = await res.json();
    const meta = data?.chart?.result?.[0]?.meta;
    const price = meta?.regularMarketPrice;
    const prev = meta?.chartPreviousClose ?? meta?.previousClose;
    if (typeof price !== "number" || typeof prev !== "number") {
      throw new Error("missing fields");
    }
    return {
      symbol: h.symbol,
      price,
      prevClose: prev,
      time: meta?.regularMarketTime ? meta.regularMarketTime * 1000 : null,
      currency: meta?.currency || "USD",
      stale: false,
    };
  } catch (e) {
    // Fall back to the statement mark so the page still renders.
    return {
      symbol: h.symbol,
      price: h.base,
      prevClose: h.base,
      time: null,
      currency: "USD",
      stale: true,
      error: String(e?.message || e),
    };
  }
}

export async function GET() {
  const results = await Promise.all(HOLDINGS.map(fetchQuote));
  const quotes = {};
  for (const q of results) quotes[q.symbol] = q;
  const anyStale = results.some((q) => q.stale);
  return NextResponse.json(
    { asOf: Date.now(), anyStale, quotes },
    { headers: { "Cache-Control": "no-store" } }
  );
}
