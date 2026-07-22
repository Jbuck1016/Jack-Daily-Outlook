import Nav from "../nav";
import data from "@/data/daily.json";
import projectsData from "@/data/projects.json";

export const dynamic = "force-dynamic";

function Ev({ e }) {
  const cls = "row" + (e.accent === "eve" ? " eve" : e.accent === "span" ? " span" : "");
  return (
    <li className={cls}>
      <div className="bar" />
      <div className="rb">
        <div className="rt">{e.time}</div>
        <div className="rn">{e.title}</div>
        {e.loc ? <div className="rl">{e.loc}</div> : null}
      </div>
    </li>
  );
}

function Item({ it }) {
  const inner = (
    <>
      {it.title}
      {it.tag ? <span className={"tag " + (it.tag === "REPLY" ? "act" : "imp")}>{it.tag}</span> : null}
    </>
  );
  return (
    <li className="it">
      <div className={"dot " + (it.dot || "")} />
      <div className="ib">
        {it.url ? (
          <a className="il" href={it.url} target="_blank" rel="noreferrer">{inner}</a>
        ) : (
          <span className="il">{inner}</span>
        )}
        {it.meta ? <div className="im">{it.meta}</div> : null}
      </div>
    </li>
  );
}

function Task({ t }) {
  return (
    <li className="it">
      <div className={"dot " + (t.dot || "faint")} />
      <div className="ib">
        <div className="il">
          {t.url ? <a className="il" href={t.url} target="_blank" rel="noreferrer">{t.title}</a> : t.title}
          {t.prio ? <span className={"prio " + t.prio.toLowerCase()}>{t.prio}</span> : null}
        </div>
        {t.meta ? <div className={"im" + (t.overdue ? " odue" : "")}>{t.meta}</div> : null}
      </div>
    </li>
  );
}

export default function Daily() {
  const d = data;
  const tasks = d.tasks || {};
  const inbox = d.inbox || {};
  return (
    <div className="wrap">
      <Nav />
      <div className="headrow">
        <h1>Daily</h1>
        <span className="updated">{d.updatedLabel ? "Updated " + d.updatedLabel : ""}</span>
      </div>
      <div className="sub">{d.dateLabel}</div>

      <div className="cols">
        <div className="stack">
          <div className="card today-card">
            <h2>Today<span className="pill">{(d.today || []).length} items</span></h2>
            <ul className="sched">
              {(d.today || []).map((e, i) => <Ev key={i} e={e} />)}
            </ul>
            {d.todayNote ? <div className="foot-note">{d.todayNote}</div> : null}
          </div>

          <div className="card">
            <h2>The rest of the week</h2>
            <ul className="up">
              {(d.week || []).map((w, i) => (
                <li className="uprow" key={i}>
                  <div className="upday">{w.day}</div>
                  <div className="upitems">
                    {w.items && w.items.length
                      ? w.items.map((it, j) => (
                          <div className="upitem" key={j}>
                            {it.time ? <span className="t">{it.time}</span> : null}{it.title}
                          </div>
                        ))
                      : <div className="upnone">Open — nothing scheduled</div>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="stack">
          <div className="card">
            <h2>Tasks · Todoist
              {tasks.pillText ? (
                <span className={"pill " + (tasks.pillWarn ? "warn" : "ok")}>{tasks.pillText}</span>
              ) : null}
            </h2>
            {tasks.overdue && tasks.overdue.length ? (
              <>
                <div className="divlabel odue">Overdue</div>
                <ul className="items">{tasks.overdue.map((t, i) => <Task key={i} t={{ ...t, overdue: true }} />)}</ul>
              </>
            ) : null}
            {tasks.recurring && tasks.recurring.length ? (
              <>
                <div className="divlabel">Today · recurring</div>
                <ul className="items">{tasks.recurring.map((t, i) => <Task key={i} t={t} />)}</ul>
              </>
            ) : null}
          </div>

          <div className="card">
            <h2>Follow-ups</h2>
            <ul className="items">{(d.followups || []).map((it, i) => <Item key={i} it={it} />)}</ul>
          </div>

          <div className="card">
            <h2>Inbox — needs attention
              {typeof inbox.unread === "number" ? <span className="pill">{inbox.unread} unread</span> : null}
            </h2>
            <ul className="items">{(inbox.items || []).map((it, i) => <Item key={i} it={it} />)}</ul>
            {inbox.note ? <div className="foot-note">{inbox.note}</div> : null}
          </div>

          <div className="card">
            <h2>Recent in Drive</h2>
            <ul className="items">{(d.drive || []).map((it, i) => <Item key={i} it={{ ...it, dot: it.dot || "" }} />)}</ul>
          </div>
        </div>
      </div>

      <div className="card projects-band">
        <h2>Active Projects<span className="pill">{(projectsData.projects || []).length}</span></h2>
        <div className="projgrid">
          {(projectsData.projects || []).map((p, i) => (
            <div className={"proj" + (p.stale ? " stale" : "")} key={i}>
              <div className="ph">
                <span className={"pdot " + (p.dot || "")} />
                <span className="pname">{p.name}</span>
                {p.when ? <span className="pwhen">{p.when}</span> : null}
              </div>
              <div className="pblock">
                <span className="plabel">Latest</span>
                {p.lastUpdate
                  ? (p.url ? <a className="pval" href={p.url} target="_blank" rel="noreferrer">{p.lastUpdate}</a> : <span className="pval">{p.lastUpdate}</span>)
                  : <span className="pval faintv">Nothing logged yet — tell me what's new.</span>}
              </div>
              <div className="pblock">
                <span className="plabel">Next</span>
                {p.nextSteps && p.nextSteps.length
                  ? <ul className="pnext">{p.nextSteps.map((s, j) => <li key={j}>{s}</li>)}</ul>
                  : <span className="pval faintv">Nothing logged yet.</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="foot-note" style={{ marginTop: 20 }}>
        Sources: Google Calendar, Gmail, Google Drive, Todoist. Times in America/Los_Angeles. Refreshed hourly.
      </div>
    </div>
  );
}
