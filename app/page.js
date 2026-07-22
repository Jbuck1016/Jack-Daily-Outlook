import Nav from "./nav";
import Link from "next/link";
import daily from "@/data/daily.json";
import projectsData from "@/data/projects.json";

export const dynamic = "force-dynamic";

export default function Hub() {
  const projectCount = (projectsData.projects || []).length;
  return (
    <div className="wrap">
      <Nav />
      <div className="headrow">
        <h1>Hub</h1>
        <span className="sub">Everything in one place.</span>
      </div>
      <div className="hubgrid">
        <Link href="/daily" className="hubcard acc-amber">
          <div className="ht">Daily <span className="badge live">Live</span></div>
          <div className="hd">Today's schedule, the week ahead, tasks, follow-ups, inbox and recent files. Updated {daily.updatedLabel || "hourly"}.</div>
        </Link>
        <Link href="/projects" className="hubcard acc-emerald">
          <div className="ht">Projects <span className="badge live">Live</span></div>
          <div className="hd">A maintained log of your {projectCount} active builds — latest status and next steps for each.</div>
        </Link>
        <Link href="/inboxes" className="hubcard acc-cyan">
          <div className="ht">Inboxes <span className="badge live">Live</span></div>
          <div className="hd">The latest emails from your accounts, side by side, at a glance.</div>
        </Link>
        <Link href="/portfolio" className="hubcard acc-sky">
          <div className="ht">Portfolio <span className="badge live">Live</span></div>
          <div className="hd">A live daily overview of your holdings, allocation, and day change. Prices refresh automatically.</div>
        </Link>
        <div className="hubcard soon acc-violet">
          <div className="ht">Transfers <span className="badge soon">Soon</span></div>
          <div className="hd">Football transfer news, curated each morning.</div>
        </div>
      </div>
    </div>
  );
}
