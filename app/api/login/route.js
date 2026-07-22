import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Constant-time-ish comparison to avoid trivial timing leaks.
function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export async function POST(req) {
  let password = "";
  try {
    const body = await req.json();
    password = body?.password || "";
  } catch {
    const form = await req.formData().catch(() => null);
    if (form) password = form.get("password") || "";
  }

  const expected = process.env.DASHBOARD_PASSWORD;
  const token = process.env.AUTH_TOKEN;

  if (!expected || !token) {
    return NextResponse.json(
      { ok: false, error: "Server not configured. Set DASHBOARD_PASSWORD and AUTH_TOKEN." },
      { status: 500 }
    );
  }

  if (!safeEqual(password, expected)) {
    return NextResponse.json({ ok: false, error: "Wrong password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("dash_auth", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 60, // 60 days "remember me"
  });
  return res;
}
