import Nav from "../nav";
import cal from "@/data/calendar.json";

export const dynamic = "force-dynamic";

export default function Calendar() {
  const sources = cal.sources || [];
  const days = cal.days || [];
  const pending = sources.find((s) => s.key === "lafc-work" && !s.connected);

  return (
    <div className="wrap">
      <Nav />
      <div className="headrow">
        <h1>Calendar</h1>
        <span className="updated">{cal.updatedLabel ? "Updated " + cal.updatedLabel : ""}</span>
      </div>
      <div className="pj-intro">Your calendars in one agenda, colour-coded by source. Next two weeks.</div>

      <div className="cal-legend">
        {sources.map((s, i) => (
          <span className={"cal-chip src-" + s.key + (s.connected ? "" : " off")} key={i}>
            <span className="cal-swatch" />
            {s.name}
            {!s.connected ? <span className="cal-pending">pending</span> : null}
          </span>
        ))}
      </div>

      {pending ? (
        <div className="cal-note">
          <strong>LAFC Work</strong> is waiting on a calendar share. Share your LAFC calendar with
          jackbuckiingham@gmail.com (See all event details) and tell me — it'll drop into this agenda in gold.
        </div>
      ) : null}

      <div className="cal-agenda">
        {days.map((d, i) => (
          <div className={"cal-day" + (d.today ? " today" : "")} key={i}>
            <div className="cal-daylabel">
              {d.label}
              {d.today ? <span className="cal-todaytag">TODAY</span> : null}
            </div>
            <div className="cal-events">
              {(d.events || []).map((e, j) => (
                <div className={"cal-ev src-" + (e.src || "personal")} key={j}>
                  <span className="cal-bar" />
                  <span className="cal-time">{e.time}</span>
                  <span className="cal-body">
                    <span className="cal-title">{e.title}</span>
                    {e.loc ? <span className="cal-loc">{e.loc}</span> : null}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
