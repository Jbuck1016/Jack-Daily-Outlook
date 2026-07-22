import Nav from "../nav";
import projectsData from "@/data/projects.json";

export const dynamic = "force-dynamic";

const TONE = {
  emerald: "t-emerald",
  amber: "t-amber",
  rose: "t-rose",
  sky: "t-sky",
  cyan: "t-cyan",
  violet: "t-violet",
};

export default function Projects() {
  const projects = projectsData.projects || [];
  return (
    <div className="wrap">
      <Nav />
      <div className="headrow">
        <h1>Projects</h1>
        <span className="updated">{projects.length} active</span>
      </div>
      <div className="pj-intro">
        A maintained log of what you're building. Each card is written when we work a project or when you
        send a wrap-up — it doesn't auto-update, so it's only as fresh as the last entry.
      </div>

      <div className="pjgrid">
        {projects.map((p, i) => {
          const toneClass = TONE[p.status?.tone] || "";
          const host = p.url ? p.url.replace(/^https?:\/\//, "").replace(/\/$/, "") : "";
          return (
            <div className={"pjcard " + toneClass} key={i}>
              <div className="pjtop">
                {p.status ? <span className="pjstatus">{p.status.label}</span> : null}
                {p.updated ? <span className="pjupd">updated {p.updated}</span> : null}
              </div>

              <div className="pjname">
                {p.url ? <a href={p.url} target="_blank" rel="noreferrer">{p.name}</a> : p.name}
              </div>
              {p.url ? (
                <a className="pjurl" href={p.url} target="_blank" rel="noreferrer">{host} ↗</a>
              ) : null}

              {p.headline ? <div className="pjhead">{p.headline}</div> : null}

              <div className="pjblock">
                <div className="pjlabel">Latest</div>
                {p.lastUpdate
                  ? <div className="pjlatest">{p.lastUpdate}</div>
                  : <div className="pjlatest">Nothing logged yet — tell me what's new.</div>}
              </div>

              <div className="pjblock">
                <div className="pjlabel">Next</div>
                {p.nextSteps && p.nextSteps.length ? (
                  <ul className="pjnext">{p.nextSteps.map((s, j) => <li key={j}>{s}</li>)}</ul>
                ) : (
                  <div className="pjlatest">Nothing logged yet.</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
