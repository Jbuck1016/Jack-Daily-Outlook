import Nav from "../nav";
import dataFallback from "@/data/daily.json";
import { loadData } from "@/lib/data";

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

export default async function Daily() {
  const d = await loadData("daily.json", dataFallback);
  const tasks = d.tasks || {};
  const inbox = d.inbox || {};
  const overdue = tasks.overdue || [];
  const todos = tasks.todos || [];
  const recurring = tasks.recurring || [];
  const attn = inbox.items || [];
  const inboxPill = inbox.pillText
    ? inbox.pillText
    : typeof inbox.unread === "number"
    ? inbox.unread + " unread"
    : null;

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

          <div className="card acc-cyan">
            <h2><span className="hicon" />The rest of the week</h2>
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
          <div className="card acc-emerald">
            <h2><span className="hicon" />Tasks · Todoist
              {tasks.pillText ? (
                <span className={"pill " + (tasks.pillWarn ? "warn" : "ok")}>{tasks.pillText}</span>
              ) : null}
            </h2>

            {tasks.goalText ? (
              <div className="goalrow">
                <div className="goalbar"><span style={{ width: (tasks.goalPct || 0) + "%" }} /></div>
                <span className="goaltxt">{tasks.goalText}</span>
              </div>
            ) : null}

            {overdue.length ? (
              <>
                <div className="divlabel odue">Overdue</div>
                <ul className="items">{overdue.map((t, i) => <Task key={i} t={{ ...t, overdue: true }} />)}</ul>
              </>
            ) : null}

            {todos.length ? (
              <>
                <div className="divlabel">To-do</div>
                <ul className="items">{todos.map((t, i) => <Task key={i} t={t} />)}</ul>
              </>
            ) : !overdue.length ? (
              <div className="emptyline">No open to-dos. Clear.</div>
            ) : null}

            {recurring.length ? (
              <div className="routine">
                <div className="divlabel">Daily routine</div>
                <div className="routrip">
                  {recurring.map((r, i) => (
                    <span className="rchip" key={i}>
                      {r.meta ? <span className="rk">{r.meta}</span> : null}{r.title}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="card acc-coral">
            <h2><span className="hicon" />Needs attention
              {inboxPill ? <span className="pill">{inboxPill}</span> : null}
            </h2>
            {attn.length ? (
              <ul className="items">{attn.map((it, i) => <Item key={i} it={it} />)}</ul>
            ) : (
              <div className="emptyline">Inbox clear — nothing needs a reply.</div>
            )}
            {inbox.note ? <div className="foot-note">{inbox.note}</div> : null}
          </div>

          <div className="card acc-violet">
            <h2><span className="hicon" />Recent in Drive</h2>
            <ul className="items">{(d.drive || []).map((it, i) => <Item key={i} it={{ ...it, dot: it.dot || "" }} />)}</ul>
          </div>
        </div>
      </div>

      <div className="foot-note" style={{ marginTop: 20 }}>
        Sources: Google Calendar, Gmail, Google Drive, Todoist. Times in America/Los_Angeles. Refreshed hourly.
      </div>
    </div>
  );
}
