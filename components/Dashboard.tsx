"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  deleteVisits,
  loadVisits,
  summarize,
  visitsToCsv,
  type Filters,
  type Summary,
  type Visit,
} from "@/lib/visit-log";

const SESSION_KEY = "ecat-dashboard";
const DASHBOARD_PASSWORD = "NeverSMILE";
const pageSize = 25;

const initialFilters: Filters = {
  range: "today",
  from: "",
  to: "",
  campaign: "",
  referrer: "",
  bots: false,
  tests: false,
};

function formatNy(ms: number) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(ms);
}

export default function Dashboard() {
  const [phase, setPhase] = useState<"checking" | "login" | "ready">("checking");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [applied, setApplied] = useState<Filters>(initialFilters);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [rows, setRows] = useState<Visit[]>([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [detail, setDetail] = useState<Visit | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const apply = useCallback((source: Visit[], next: Filters) => {
    const result = summarize(source, next);
    setSummary(result.summary);
    setRows(result.rows);
  }, []);

  const load = useCallback(async () => {
    const source = await loadVisits();
    setError("");
    return source;
  }, []);

  useEffect(() => {
    const local = location.hostname === "localhost" || location.hostname === "127.0.0.1";
    const next = { ...initialFilters, tests: local };
    setFilters(next);
    setApplied(next);
    setPhase(sessionStorage.getItem(SESSION_KEY) === "1" ? "ready" : "login");
  }, []);

  useEffect(() => {
    if (phase !== "ready") return;
    let cancelled = false;
    const pull = () => {
      void load()
        .then((source) => {
          if (!cancelled) apply(source, applied);
        })
        .catch(() => {
          if (!cancelled) setError("Visitor records could not be loaded.");
        });
    };
    pull();
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") pull();
    }, 10000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [phase, applied, load, apply]);

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
    setSummary(null);
    setDetail(null);
  }

  async function removeSelected() {
    await deleteVisits(selected);
    setNotice(`Deleted ${selected.length} visits.`);
    setSelected([]);
    setConfirmDelete(false);
    setDetail(null);
    const source = await load();
    apply(source, applied);
    setPage(1);
  }

  function exportCsv() {
    const blob = new Blob([visitsToCsv(rows)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ethercat-visits.csv";
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Export downloaded.");
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
            {loginError && <p role="alert">{loginError}</p>}
          </form>
        )}
      </main>
    );
  }

  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const visible = rows.slice((page - 1) * pageSize, page * pageSize);
  const maxTrend = Math.max(1, ...(summary?.trend.map((bucket) => bucket.visitors) ?? [1]));
  const peak =
    summary && summary.trend.length > 0
      ? summary.trend.reduce((best, bucket) => (bucket.visitors > best.visitors ? bucket : best), summary.trend[0])
      : undefined;

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
        Each browser is counted once. Times are America/New_York. IP addresses are not stored.
      </p>
      {notice && <p role="status">{notice}</p>}
      <form
        className="dash-filters"
        onSubmit={(event) => {
          event.preventDefault();
          setApplied(filters);
          setPage(1);
          setConfirmDelete(false);
        }}
      >
        <div className="dash-filter-fields">
          <label>
            Range
            <select
              value={filters.range}
              onChange={(event) => setFilters({ ...filters, range: event.target.value as Filters["range"] })}
            >
              <option value="today">Today in New York</option>
              <option value="24h">Rolling last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="custom">Custom range</option>
            </select>
          </label>
          {filters.range === "custom" && (
            <>
              <label>
                From
                <input type="date" value={filters.from} onChange={(event) => setFilters({ ...filters, from: event.target.value })} required />
              </label>
              <label>
                To
                <input type="date" value={filters.to} onChange={(event) => setFilters({ ...filters, to: event.target.value })} required />
              </label>
            </>
          )}
          <label>
            Campaign
            <input value={filters.campaign} onChange={(event) => setFilters({ ...filters, campaign: event.target.value })} />
          </label>
          <label>
            Referrer
            <input value={filters.referrer} onChange={(event) => setFilters({ ...filters, referrer: event.target.value })} />
          </label>
        </div>
        <div className="dash-filter-actions">
          <label className="dash-check">
            <input
              type="checkbox"
              checked={filters.bots}
              onChange={(event) => {
                const next = { ...filters, bots: event.target.checked };
                setFilters(next);
                setApplied(next);
              }}
            />
            Include likely bots
          </label>
          <label className="dash-check">
            <input
              type="checkbox"
              checked={filters.tests}
              onChange={(event) => {
                const next = { ...filters, tests: event.target.checked };
                setFilters(next);
                setApplied(next);
              }}
            />
            Include admin and development traffic
          </label>
          <button className="button primary" type="submit">
            Apply filters
          </button>
        </div>
      </form>

      {!summary && !error && <p role="status">Loading visitor records…</p>}
      {error && (
        <p role="alert">
          {error}{" "}
          <button type="button" onClick={() => void load().then((source) => apply(source, applied))}>
            Retry
          </button>
        </p>
      )}
      {summary && (
        <>
          <p className="dash-refresh">Last refresh: {formatNy(summary.generatedAt)}</p>
          <section className="dash-stats" aria-label="Summary">
            <article className="is-lead">
              <p>Active visitors</p>
              <strong>{summary.activeVisitors}</strong>
              <span>Browsers seen in the last 90 seconds</span>
            </article>
            <article>
              <p>Unique visitors</p>
              <strong>{summary.browserVisitors}</strong>
              <span>Each browser once in this range</span>
            </article>
            <article>
              <p>Visits</p>
              <strong>{summary.visits}</strong>
              <span>Separate sessions</span>
            </article>
            <article>
              <p>Page views</p>
              <strong>{summary.pageViews}</strong>
              <span>Loads in this range</span>
            </article>
            <article className="dash-cta">
              <div>
                <p>CTA clicks</p>
                <strong>{summary.clicks.total}</strong>
              </div>
              <ul className="cta-chips">
                <li><span>Copy</span><strong>{summary.clicks.copy}</strong></li>
                <li><span>Telegram</span><strong>{summary.clicks.telegram}</strong></li>
                <li><span>X</span><strong>{summary.clicks.x}</strong></li>
              </ul>
            </article>
          </section>
          <section className="dash-card" aria-labelledby="trend-heading">
            <div className="dash-top">
              <h2 id="trend-heading">Visit trend</h2>
              <p className="dash-quiet">
                {summary.trendUnit === "day" ? "Unique visitors per day" : "Unique visitors per hour"}
                {peak && peak.visitors > 0 ? ` · Peak ${peak.visitors} at ${peak.label}` : ""}
              </p>
            </div>
            {summary.trend.every((bucket) => bucket.visitors === 0) ? (
              <p>No visitors in this range.</p>
            ) : (
              <div className="trend-chart" role="list" aria-label="Unique visitors over time">
                {summary.trend.map((bucket) => {
                  const height = bucket.visitors === 0 ? 0 : Math.max(8, (bucket.visitors / maxTrend) * 100);
                  return (
                    <div className={bucket.visitors > 0 ? "trend-col" : "trend-col is-zero"} key={bucket.start} role="listitem" title={`${bucket.label}: ${bucket.visitors}`}>
                      <span className="trend-count">{bucket.visitors > 0 ? bucket.visitors : ""}</span>
                      <span className="trend-bar" aria-hidden="true">
                        <span style={{ height: `${height}%` }} />
                      </span>
                      <span className="trend-label">{bucket.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
          <div className="dash-split">
            <section className="dash-card" aria-labelledby="referrer-heading">
              <h2 id="referrer-heading">Referrals</h2>
              {summary.referrals.length === 0 ? (
                <p>No referrals in this range.</p>
              ) : (
                <ul>
                  {summary.referrals.map((row) => (
                    <li key={row.host}>
                      {row.host}: {row.visits}
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section className="dash-card" aria-labelledby="campaign-heading">
              <h2 id="campaign-heading">Campaigns</h2>
              {summary.campaigns.length === 0 ? (
                <p>No campaigns in this range.</p>
              ) : (
                <ul>
                  {summary.campaigns.map((row) => (
                    <li key={`${row.source}-${row.medium}-${row.campaign}`}>
                      {[row.source, row.medium, row.campaign].filter(Boolean).join(" / ")}: {row.visits}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}

      <section className="dash-card" aria-labelledby="history-heading">
        <div className="dash-top">
          <div>
            <h2 id="history-heading">Visit history</h2>
            <p className="dash-quiet">Location is the city, region, and country for each visit.</p>
          </div>
          <div className="dash-actions">
            <button className="button" type="button" onClick={exportCsv}>
              Export CSV
            </button>
            <button className="button" type="button" disabled={selected.length === 0} onClick={() => setConfirmDelete(true)}>
              Delete selected
            </button>
          </div>
        </div>
        {confirmDelete && (
          <p className="dash-confirm">
            Delete {selected.length} selected visits?
            <button type="button" onClick={() => void removeSelected()}>
              Confirm delete
            </button>
            <button type="button" onClick={() => setConfirmDelete(false)}>
              Cancel
            </button>
          </p>
        )}
        {summary && rows.length === 0 && <p>No visits in this range.</p>}
        <ul className="visit-list">
          {visible.map((visit) => (
            <li className="visit-row" key={visit.id}>
              <input
                type="checkbox"
                checked={selected.includes(visit.id)}
                aria-label={`Select visit from ${visit.location || "unknown place"}`}
                onChange={(event) => {
                  setSelected((current) =>
                    event.target.checked ? [...current, visit.id] : current.filter((id) => id !== visit.id),
                  );
                }}
              />
              <div>
                <p className="visit-place">
                  <strong>{visit.location || "Unavailable"}</strong>
                  <span>{visit.classification}</span>
                </p>
                <p>
                  Started {formatNy(visit.startedAt)} · Last seen {formatNy(visit.lastSeen)}
                </p>
                <p className="dash-quiet">
                  {visit.path}
                  {visit.section ? ` · ${visit.section}` : ""} · {visit.browser} / {visit.os} / {visit.device} · {visit.referrer}
                  {visit.utmCampaign ? ` · ${visit.utmCampaign}` : ""}
                </p>
              </div>
              <button type="button" onClick={() => setDetail(visit)}>
                View
              </button>
            </li>
          ))}
        </ul>
        <div className="dash-pager">
          <button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
            Previous
          </button>
          <span>
            Page {page} of {pages}
          </span>
          <button type="button" disabled={page >= pages} onClick={() => setPage((current) => current + 1)}>
            Next
          </button>
        </div>
        {detail && (
          <article className="dash-detail" aria-labelledby="detail-heading">
            <h3 id="detail-heading">Visit details</h3>
            <p>
              {detail.path} · {detail.section ?? "no section"} · {detail.classification}
            </p>
            <p>Location: {detail.location || "Unavailable"}</p>
            <p>
              Started {formatNy(detail.startedAt)}. Last seen {formatNy(detail.lastSeen)}.
            </p>
            <h4>Page views</h4>
            {detail.pageViews.length === 0 ? (
              <p>No page views stored.</p>
            ) : (
              <ul>
                {detail.pageViews.map((view) => (
                  <li key={`${view.createdAt}-${view.path}`}>
                    {formatNy(view.createdAt)} · {view.path}
                  </li>
                ))}
              </ul>
            )}
            <h4>CTA clicks</h4>
            {detail.clicks.length === 0 ? (
              <p>No CTA clicks stored.</p>
            ) : (
              <ul>
                {detail.clicks.map((click) => (
                  <li key={`${click.createdAt}-${click.kind}`}>
                    {formatNy(click.createdAt)} · {click.kind}
                  </li>
                ))}
              </ul>
            )}
            <button type="button" onClick={() => setDetail(null)}>
              Close details
            </button>
          </article>
        )}
      </section>
      <p className="dash-back">
        <Link href="/">Back to the kingdom</Link>
      </p>
    </main>
  );
}
