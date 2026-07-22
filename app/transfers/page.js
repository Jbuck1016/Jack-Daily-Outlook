import Nav from "../nav";

export const dynamic = "force-dynamic";

export default function Transfers() {
  return (
    <div className="wrap">
      <Nav />
      <div className="headrow">
        <h1>Transfers</h1>
        <span className="sub">Football transfer news</span>
      </div>
      <div className="placeholder">
        <div className="pi">Coming soon</div>
        Curated football transfer news, gathered each morning. We'll wire up the sources when you're ready to build this one out.
      </div>
    </div>
  );
}
