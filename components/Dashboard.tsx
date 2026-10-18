"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useKingdomStats } from "./useKingdomStats";

const SESSION_KEY = "ecat-dashboard";
const DASHBOARD_PASSWORD = "NeverSMILE";

function figure(state: string, value: number | null, loading: string, missing: string) {
  if (state === "ready" || state === "live") {
    return value === null ? missing : value.toLocaleString("en-US");
  }
  if (state === "unavailable") return missing;
  return loading;
}

export default function Dashboard() {
  const [phase, setPhase] = useState<"checking" | "login" | "ready">("checking");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [refreshedAt, setRefreshedAt] = useState<number | null>(null);
  const stats = useKingdomStats(false, phase === "ready");

  useEffect(() => {
    setPhase(sessionStorage.getItem(SESSION_KEY) === "1" ? "ready" : "login");
  }, []);

  useEffect(() => {
    if (phase !== "ready") return;
    if (stats.liveState === "loading" && stats.visitState === "loading") return;
    setRefreshedAt(Date.now());
  }, [phase, stats.live, stats.visits, stats.pageViews, stats.liveState, stats.visitState]);

  function onLogin(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setLoginError("");
    if (password !== DASHBOARD_PASSWORD) {
      setLoginError("Incorrect password. Please try again.");
      setSubmitting(false);
      return;
    }
    sessionStorage.setItem(SESSION_KEY, "1");
    setPassword("");
    setSubmitting(false);
    setPhase("ready");
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    setPhase("login");
    setRefreshedAt(null);
  }

  if (phase !== "ready") {
    return (
      <main className="dash" id="main">
        <p className="eyebrow">Ethercat</p>
        <h1>Private visitor dashboard</h1>
        {phase === "checking" ? (
          <p role="status">Checking session…</p>
        ) : (
          <form className="dash-card" onSubmit={onLogin}>
            <label htmlFor="dashboard-password">Password</label>
            <input
              id="dashboard-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button className="button primary" type="submit" disabled={submitting}>
              Open dashboard
            </button>
            {loginError && (
              <p role="alert" id="dashboard-login-error">
                {loginError}
              </p>
            )}
          </form>
        )}
      </main>
    );
  }

  const refreshed =
    refreshedAt === null
      ? "Waiting for the first count…"
      : new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }).format(refreshedAt);

  return (
    <main className="dash" id="main">
      <div className="dash-top">
        <div>
          <p className="eyebrow">Ethercat</p>
          <h1>Private visitor dashboard</h1>
        </div>
        <button className="button" type="button" onClick={logout}>
          Log out
        </button>
      </div>
      <p className="dash-note">
        Active visitors are open sessions. Visits count once per browser session. Page views count each load.
        Times follow this browser.
      </p>
      <p className="dash-refresh">Last refresh: {refreshed}</p>
      <section className="dash-stats" aria-label="Summary">
        <article className="is-lead">
          <p>Active visitors</p>
          <strong>{figure(stats.liveState, stats.live, "…", "Unavailable")}</strong>
          <span>Open sessions right now</span>
        </article>
        <article>
          <p>Visits</p>
          <strong>{figure(stats.visitState, stats.visits, "…", "Unavailable")}</strong>
          <span>One count per browser session</span>
        </article>
        <article>
          <p>Page views</p>
          <strong>{figure(stats.pageViewState, stats.pageViews, "…", "Unavailable")}</strong>
          <span>Each time the kingdom page loads</span>
        </article>
      </section>
      <p className="dash-back">
        <Link href="/">Back to the kingdom</Link>
      </p>
    </main>
  );
}
