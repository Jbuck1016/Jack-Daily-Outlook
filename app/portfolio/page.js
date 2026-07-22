"use client";

import { useEffect, useState, useCallback } from "react";
import Nav from "../nav";
import brief from "@/data/portfolio-brief.json";
import {
  HOLDINGS,
  CASH,
  STATEMENT_VALUE,
  YTD_BASE,
  EQUITY_COST,
} from "@/lib/holdings";

const usd = (n, d = 0) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
const pct = (x) => (x >= 0 ? "+" : "") + x.toFixed(2) + "%";
const signed = (x, d = 0) => (x >= 0 ? "+" : "\u2212") + usd(Math.abs(x), d);
const cls = (x) => (x >= 0 ? "up" : "down");

function compute(quotes) {
  const rows = HOLDINGS.map((h) => {
    const q = quotes?.[h.symbol];
    const price = q ? q.price : h.base;
    const prev = q ? q.prevClose : h.base;
    const mv = price * h.shares;
    const day = mv - prev * h.shares;
    const dpct = prev ? (price / prev - 1) * 100 : 0;
    return { h, price, mv, day, dpct, gl: mv - h.cost, stale: q ? q.stale : true };
  });
  const equityMv = rows.reduce((a, r) => a + r.mv, 0);
  const total = equityMv + CASH.value;
  const dayTot = rows.reduce((a, r) => a + r.day, 0);
  const prevTot = total - dayTot;
  const glTot = equityMv - EQUITY_COST;
  return {
    rows,
    equityMv,
    total,
    dayTot,
    dayPct: prevTot ? (dayTot / prevTot) * 100 : 0,
    glTot,
    glPct: EQUITY_COST ? (glTot / EQUITY_COST) * 100 : 0,
    ytd: total - YTD_BASE,
    ytdPct: ((total - YTD_BASE) / YTD_BASE) * 100,
    stmt: total - STATEMENT_VALUE,
    stmtPct: ((total - STATEMENT_VALUE) / STATEMENT_VALUE) * 100,
  };
}

function Donut({ rows, total }) {
  const segs = rows.map((r) => ({ t: r.h.t, w: (r.mv / total) * 100, color: r.h.color }));
  segs.push({ t: "CASH", w: (CASH.value / total) * 100, color: CASH.color });
  const r = 56,
    C = 2 * Math.PI * r;
  let off = 0;
  return (
    <div className="pf-donutrow">
      <svg width="150" height="150" viewBox="0 0 150 150">
        {segs.map((s, i) => {
          const len = C * (s.w / 100);
          const el = (
            <circle
              key={i}
              cx="75"
              cy="75"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="22"
              strokeDasharray={`${len} ${C - len}`}
              strokeDashoffset={-off}
              transform="rotate(-90 75 75)"
            />
          );
          off += len;
          return el;
        })}
        <text x="75" y="72" textAnchor="middle" fontSize="15" fill="#e7e9ee" fontWeight="600">
          {usd(total)}
        </text>
        <text x="75" y="87" textAnchor="middle" fontSize="8.5" letterSpacing="1.2" fill="#9aa2b1">
          TOTAL
        </text>
      </svg>
      <div className="pf-legend">
        {segs
          .slice()
          .sort((a, b) => b.w - a.w)
          .map((s, i) => (
            <div className="pf-leg" key={i}>
              <span className="dotc" style={{ background: s.color }} />
              <span className="lt">{s.t}</span>
              <span className="lw">{s.w.toFixed(1)}%</span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [quotes, setQuotes] = useState(null);
  const [asOf, setAsOf] = useState(null);
  const [stale, setStale] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/quotes", { cache: "no-store" });
      if (!res.ok) throw new Error("quote fetch failed");
      const data = await res.json();
      setQuotes(data.quotes);
      setAsOf(data.asOf);
      setStale(Boolean(data.anyStale));
      setErr("");
    } catch (e) {
      setErr("Live prices are unavailable right now, showing last known values.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 60000);
    return () => clearInterval(id);
  }, [load]);

  const m = compute(quotes);
  const asOfLabel = asOf
    ? new Date(asOf).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/Los_Angeles",
      })
    : "";

  return (
    <div className="wrap">
      <Nav />
      <div className="headrow">
        <h1>Portfolio</h1>
        <span className="updated">
          {loading ? "Loading live prices\u2026" : asOfLabel ? "As of " + asOfLabel : ""}
        </span>
      </div>
      <div className="sub">Live daily overview of your holdings</div>

      {err ? <div className="pf-flag">{err}</div> : null}
      {!err && stale ? (
        <div className="pf-flag">Some quotes could not refresh, those rows show the last statement mark.</div>
      ) : null}

      <div className="pf-hero">
        <div className="card pf-total">
          <div className="pf-lbl">Total portfolio value</div>
          <div className="pf-val">{usd(m.total)}</div>
          <div className="pf-subline">
            Equities {usd(m.equityMv)} &middot; Cash {usd(CASH.value)}
          </div>
          <div className={"pf-chip " + cls(m.dayTot)}>
            {signed(m.dayTot)} today <span>{pct(m.dayPct)}</span>
          </div>
        </div>
        <div className="pf-stats">
          <div className="card pf-stat">
            <span className="pf-lbl2">Total gain / loss vs cost</span>
            <span className={"pf-num " + cls(m.glTot)}>
              {signed(m.glTot)} <em>{pct(m.glPct)}</em>
            </span>
          </div>
          <div className="card pf-stat">
            <span className="pf-lbl2">Year to date</span>
            <span className={"pf-num " + cls(m.ytd)}>
              {signed(m.ytd)} <em>{pct(m.ytdPct)}</em>
            </span>
          </div>
          <div className="card pf-stat">
            <span className="pf-lbl2">Since 6/30 statement</span>
            <span className={"pf-num " + cls(m.stmt)}>
              {signed(m.stmt)} <em>{pct(m.stmtPct)}</em>
            </span>
          </div>
        </div>
      </div>

      <div className="pf-grid">
        <div className="card">
          <h2>Allocation</h2>
          <Donut rows={m.rows} total={m.total} />
        </div>

        <div className="card">
          <h2>Holdings</h2>
          <table className="pf-table">
            <thead>
              <tr>
                <th className="l">Holding</th>
                <th>Price</th>
                <th>Day</th>
                <th>Value</th>
                <th className="l wcol">Weight</th>
                <th>Gain / loss</th>
              </tr>
            </thead>
            <tbody>
              {m.rows.map((r) => {
                const w = (r.mv / m.total) * 100;
                return (
                  <tr key={r.h.t}>
                    <td className="l">
                      <span className="tk">{r.h.t}</span>
                      <div className="nm">{r.h.name}</div>
                    </td>
                    <td>{usd(r.price, 2)}</td>
                    <td className={cls(r.day)}>{pct(r.dpct)}</td>
                    <td>{usd(r.mv)}</td>
                    <td className="l wcol">
                      <div className="wtxt">{w.toFixed(1)}%</div>
                      <div className="wbar">
                        <span style={{ width: w.toFixed(1) + "%", background: r.h.color }} />
                      </div>
                    </td>
                    <td className={cls(r.gl)}>{signed(r.gl)}</td>
                  </tr>
                );
              })}
              <tr>
                <td className="l">
                  <span className="tk">CASH</span>
                  <div className="nm">{CASH.name}</div>
                </td>
                <td>&mdash;</td>
                <td>&mdash;</td>
                <td>{usd(CASH.value)}</td>
                <td className="l wcol">
                  <div className="wtxt">{((CASH.value / m.total) * 100).toFixed(1)}%</div>
                  <div className="wbar">
                    <span
                      style={{
                        width: ((CASH.value / m.total) * 100).toFixed(1) + "%",
                        background: CASH.color,
                      }}
                    />
                  </div>
                </td>
                <td>&mdash;</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td className="l">Total</td>
                <td></td>
                <td className={cls(m.dayTot)}>{pct(m.dayPct)}</td>
                <td>{usd(m.total)}</td>
                <td className="l wcol"></td>
                <td className={cls(m.glTot)}>{signed(m.glTot)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="card pf-brief">
        <div className="pf-briefhead">
          <h2>Market brief</h2>
          <span className="upd">Updated {brief.updatedLabel}</span>
        </div>
        <div className="ctx">{brief.context}</div>
        {brief.analysis.map((a, i) => (
          <div className="an" key={i}>
            <h3>{a.title}</h3>
            <p>{a.body}</p>
          </div>
        ))}
      </div>

      <div className="pf-newsgrid">
        {brief.news.map((n, i) => (
          <div className="card" key={i}>
            <h2>
              {n.symbol} &middot; {n.name}
            </h2>
            {n.items.map((it, j) => (
              <div className="news-item" key={j}>
                <span className="nd">{it.date}</span>
                <span className="nh">
                  {it.headline} <span className="ns">{it.source}</span>
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="foot-note" style={{ marginTop: 20 }}>
        Positions and cost basis from your J.P. Morgan statement dated 6/30/2026. Prices via Yahoo
        Finance with a Stooq fallback, refreshed on load and every 60 seconds, and may be delayed.
        The market brief and news are refreshed periodically, not live. Informational only, not a tax
        document or investment advice.
      </div>
    </div>
  );
}
