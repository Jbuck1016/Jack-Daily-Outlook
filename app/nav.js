"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const LINKS = [
  { href: "/", label: "hub" },
  { href: "/daily", label: "daily" },
  { href: "/projects", label: "projects" },
  { href: "/portfolio", label: "portfolio" },
  { href: "/transfers", label: "transfers" },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="topbar">
      <div className="brand">
        <span className="prompt">›</span>Jack's Terminal<span className="cursor" />
      </div>
      <div className="navlinks">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className={pathname === l.href ? "active" : ""}>
            {l.label}
          </Link>
        ))}
        <button className="logout" onClick={logout}>exit</button>
      </div>
    </div>
  );
}
