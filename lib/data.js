// Reads dashboard data live from the repo's main branch at request time,
// so new data (pushed by the refresh job) shows up WITHOUT a Vercel rebuild.
// Falls back to the copy bundled at build time if the fetch ever fails.
const RAW =
  "https://raw.githubusercontent.com/Jbuck1016/Jack-Daily-Outlook/main/data/";

export async function loadData(file, fallback) {
  try {
    const res = await fetch(RAW + file, { cache: "no-store" });
    if (!res.ok) throw new Error("status " + res.status);
    return await res.json();
  } catch {
    return fallback;
  }
}
