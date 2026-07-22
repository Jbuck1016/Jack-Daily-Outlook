import Nav from "../nav";
import inboxes from "@/data/inboxes.json";

export const dynamic = "force-dynamic";

function fmt(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/Los_Angeles",
    });
  } catch {
    return "";
  }
}

const TONES = ["acc-sky", "acc-violet", "acc-emerald", "acc-amber"];

export default function Inboxes() {
  const accounts = inboxes.accounts || [];
  const totalUnread = accounts
    .filter((a) => a.connected)
    .reduce((n, a) => n + (a.emails || []).filter((e) => e.unread).length, 0);

  return (
    <div className="wrap">
      <Nav />
      <div className="headrow">
        <h1>Inboxes</h1>
        <span className="updated">{totalUnread} unread across connected accounts</span>
      </div>
      <div className="pj-intro">The latest in each mailbox, side by side. Click any message to open it in Gmail.</div>

      <div className="ibx-grid">
        {accounts.map((a, i) => {
          const unread = (a.emails || []).filter((e) => e.unread).length;
          return (
            <div className={"card ibx-acc " + (TONES[i] || "acc-sky")} key={i}>
              <div className="ibx-head">
                <div className="ibx-acct">
                  <span className="ibx-email">{a.email}</span>
                  <span className="ibx-role">{a.label}</span>
                </div>
                {a.connected ? (
                  <span className="pill">{unread} unread</span>
                ) : (
                  <span className="pill warn">not connected</span>
                )}
              </div>

              {a.connected ? (
                <>
                  <ul className="ibx-list">
                    {(a.emails || []).map((e, j) => (
                      <li className={"ibx-row" + (e.unread ? " unread" : "")} key={j}>
                        <span className="ibx-dot" />
                        <a className="ibx-body" href={e.url || "#"} target="_blank" rel="noreferrer">
                          <div className="ibx-line1">
                            <span className="ibx-from">{e.from}</span>
                            <span className="ibx-time">{fmt(e.date)}</span>
                          </div>
                          <div className="ibx-subj">
                            {e.subject}
                            {e.tag ? <span className="tag imp">{e.tag}</span> : null}
                          </div>
                          <div className="ibx-snip">{e.snippet}</div>
                        </a>
                      </li>
                    ))}
                  </ul>
                  {a.updated ? (
                    <div className="foot-note">Pulled {fmt(a.updated)} PT · refreshes hourly.</div>
                  ) : null}
                </>
              ) : (
                <div className="ibx-empty">
                  <div className="ibx-empty-t">This inbox isn't connected yet</div>
                  <p>
                    To show {a.email} here, connect it as a second Gmail account in Claude's connector
                    settings, then tell me and I'll wire it in. The Gmail connection is authenticated to one
                    account at a time, so this one needs its own sign-in.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
