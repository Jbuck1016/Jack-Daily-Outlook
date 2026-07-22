import Nav from "./nav";
import Link from "next/link";
import daily from "@/data/daily.json";

export const dynamic = "force-dynamic";

export default function Hub() {
  return (
    <div className="wrap">
      <Nav />
      <div className="headrow">
        <h1>Hub</h1>
        <span className="sub">Your daily dashboards, one place.</span>
      </div>
      <div className="hubgrid">
        <Link href="/daily" className="hubcard">
          <div className="ht">Daily <span className="badge live">Live</span></div>
          <div className="hd">Today's schedule, the week ahead, tasks, follow-ups, inbox and recent files. Updated {daily.updatedLabel || "each weekday morning"}.</div>
        </Link>
        <Link href="/portfolio" className="hubcard">
          <div className="ht">Portfolio <span className="badge live">Live</span></div>
          <div className="hd">A live daily overview of your holdings, allocation, and day change. Prices refresh automatically.</div>
        </Link>
        <div className="hubcard soon">
          <div className="ht">Transfers <span className="badge soon">Soon</span></div>
          <div className="hd">Football transfer news, curated each morning.</div>
        </div>
      </div>
    </div>
  );
}
