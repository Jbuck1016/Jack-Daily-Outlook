import Nav from "../nav";

export const dynamic = "force-dynamic";

export default function Portfolio() {
  return (
    <div className="wrap">
      <Nav />
      <div className="headrow">
        <h1>Portfolio</h1>
        <span className="sub">Daily overview</span>
      </div>
      <div className="placeholder">
        <div className="pi">Coming soon</div>
        A daily snapshot of your holdings and performance will live here, refreshed each morning alongside the rest of the hub.
      </div>
    </div>
  );
}
