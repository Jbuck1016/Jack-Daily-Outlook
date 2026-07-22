"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push(next);
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setErr(data.error || "Wrong password.");
        setBusy(false);
      }
    } catch {
      setErr("Something went wrong. Try again.");
      setBusy(false);
    }
  }

  return (
    <form className="loginbox" onSubmit={submit}>
      <h1>Jack's Hub</h1>
      <p>Enter your password to continue.</p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        autoFocus
        autoComplete="current-password"
      />
      <button type="submit" disabled={busy || !password}>
        {busy ? "Checking…" : "Unlock"}
      </button>
      <div className="err">{err}</div>
    </form>
  );
}

export default function Login() {
  return (
    <div className="loginwrap">
      <Suspense fallback={<div className="loginbox"><h1>Jack's Hub</h1></div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
