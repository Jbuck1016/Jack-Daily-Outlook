// Positions from the J.P. Morgan UTMA statement dated 2026-06-30.
// Prices update live via /api/quotes; `base` is the statement mark used
// as a fallback if a live quote is unavailable.
export const HOLDINGS = [
  { t: "HD",   symbol: "HD",   name: "Home Depot",                      shares: 848, cost: 42379.40, base: 352.68, color: "#6ea8fe" },
  { t: "SPY",  symbol: "SPY",  name: "SPDR S&P 500 ETF",                shares: 75,  cost: 21358.08, base: 746.77, color: "#f5c542" },
  { t: "VT",   symbol: "VT",   name: "Vanguard Total World Stock ETF",  shares: 218, cost: 25790.57, base: 156.95, color: "#34d399" },
  { t: "SPSM", symbol: "SPSM", name: "SPDR Portfolio S&P 600 Small Cap",shares: 222, cost: 9380.15,  base: 57.67,  color: "#f87171" },
  { t: "MSGS", symbol: "MSGS", name: "Madison Square Garden Sports A",  shares: 30,  cost: 5101.05,  base: 401.84, color: "#a78bfa" },
  { t: "VUG",  symbol: "VUG",  name: "Vanguard Growth ETF",             shares: 120, cost: 9214.00,  base: 86.14,  color: "#fbbf24" },
];

export const CASH = { t: "CASH", name: "JPMorgan sweep", value: 27042.91, color: "#6b7280" };

// Reference points from the statement, for YTD and period comparisons.
export const STATEMENT_VALUE = 451533.14; // total account value as of 2026-06-30
export const YTD_BASE = 425138.51;        // account value at the start of the year

export const EQUITY_COST = HOLDINGS.reduce((a, h) => a + h.cost, 0);
