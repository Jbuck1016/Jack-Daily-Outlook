"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const LINKS = [
  { href: "/", label: "Hub" },
  { href: "/daily", label: "Daily" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/transfers", label: "Transfers" },
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
      <div className="brand"><span className="dotmark" />Jack's Hub</div>
      <div className="navlinks">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className={pathname === l.href ? "active" : ""}>
            {l.label}
          </Link>
        ))}
        <button className="logout" onClick={logout}>Sign out</button>
      </div>
    </div>
  );
}
