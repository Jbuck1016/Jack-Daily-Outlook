import { NextResponse } from "next/server";

// Gate every route behind the login cookie, except the login page,
// the login/logout API, Next internals, and static assets.
const PUBLIC_PATHS = ["/login"];

export function middleware(req) {
  const { pathname } = req.nextUrl;

  const isPublic =
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith("/api/login") ||
    pathname.startsWith("/api/logout") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt";

  if (isPublic) return NextResponse.next();

  const token = req.cookies.get("dash_auth")?.value;
  const expected = process.env.AUTH_TOKEN;

  if (token && expected && token === expected) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  // Run on everything except static files with an extension and _next assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
