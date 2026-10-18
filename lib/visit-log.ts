const NAMESPACE = "ecat-court-7k2m9q";
const STORE_KEY = "c5baa5af4754852150d2a63649e146c480d6876fec9dce762c129eb85cc39f4e";
const ROOT = `https://mantledb.sh/v2/${NAMESPACE}`;
const SHARD_LIMIT = 48000;

export type ClickKind = "copy" | "telegram" | "x";
export type VisitClass = "browser" | "bot" | "test";

export type Visit = {
  id: string;
  visitorId: string;
  startedAt: number;
  lastSeen: number;
  path: string;
  section: string | null;
  browser: string;
  os: string;
  device: string;
  referrer: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  classification: VisitClass;
  location: string;
  pageViews: { path: string; createdAt: number }[];
  clicks: { kind: ClickKind; createdAt: number }[];
};

export type Filters = {
  range: "today" | "24h" | "7d" | "custom";
  from: string;
  to: string;
  campaign: string;
  referrer: string;
  bots: boolean;
  tests: boolean;
};

export type Summary = {
  activeVisitors: number;
  browserVisitors: number;
  visits: number;
  pageViews: number;
  clicks: { copy: number; telegram: number; x: number; total: number };
  trend: { start: number; label: string; visitors: number }[];
  trendUnit: "hour" | "day";
  referrals: { host: string; visits: number }[];
  campaigns: { source: string; medium: string; campaign: string; visits: number }[];
  generatedAt: number;
};

type Shard = { visits: Visit[] };
type Catalog = { shards: string[] };

const sections = new Set(["home", "accident", "royal-affairs", "vault", "entry", "gallery", "court"]);

export function isDashboardPath(pathname: string) {
  const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  return path.endsWith("/dashboard");
}

export function trackClick(kind: ClickKind) {
  window.dispatchEvent(new CustomEvent("ecat-click", { detail: kind }));
}

function headers(json = false): HeadersInit {
  return {
    accept: "application/json",
    "x-mantle-key": STORE_KEY,
    ...(json ? { "content-type": "application/json" } : {}),
  };
}

async function readEntry<T>(path: string): Promise<T | null> {
  const response = await fetch(`${ROOT}/${path}`, { headers: headers(), cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("The visitor record could not be read.");
  return (await response.json()) as T;
}

async function writeEntry(path: string, value: unknown) {
  const response = await fetch(`${ROOT}/${path}`, {
    method: "POST",
    headers: headers(true),
    body: JSON.stringify(value),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("The visitor record could not be saved.");
}

export async function loadVisits(): Promise<Visit[]> {
  const catalog = await readEntry<Catalog>("catalog");
  if (!catalog?.shards?.length) return [];
  const shards = await Promise.all(catalog.shards.map((name) => readEntry<Shard>(name)));
  return shards.flatMap((shard) => shard?.visits ?? []);
}

async function catalogOrNew(): Promise<Catalog> {
  return (await readEntry<Catalog>("catalog")) ?? { shards: ["s0"] };
}

function fits(visits: Visit[]) {
  return JSON.stringify({ visits }).length <= SHARD_LIMIT;
}

export async function upsertVisit(visit: Visit) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const catalog = await catalogOrNew();
    const names = catalog.shards.length ? catalog.shards : ["s0"];
    const shards = await Promise.all(names.map(async (name) => ({ name, shard: (await readEntry<Shard>(name)) ?? { visits: [] } })));
    const found = shards.find((entry) => entry.shard.visits.some((item) => item.id === visit.id));
    if (found) {
      found.shard.visits = found.shard.visits.map((item) => (item.id === visit.id ? visit : item));
      await writeEntry(found.name, found.shard);
      return;
    }
    let target = shards[shards.length - 1] ?? { name: "s0", shard: { visits: [] } };
    const nextVisits = [...target.shard.visits, visit];
    if (!fits(nextVisits)) {
      const name = `s${names.length}`;
      await writeEntry("catalog", { shards: [...names, name] });
      await writeEntry(name, { visits: [visit] });
    } else {
      if (!names.includes(target.name)) names.push(target.name);
      await writeEntry("catalog", { shards: names });
      await writeEntry(target.name, { visits: nextVisits });
    }
    const saved = await loadVisits();
    if (saved.some((item) => item.id === visit.id)) return;
    await new Promise((resolve) => setTimeout(resolve, 80 * (attempt + 1)));
  }
  throw new Error("The visitor record could not be saved.");
}

export async function deleteVisits(ids: string[]) {
  const drop = new Set(ids);
  const catalog = await catalogOrNew();
  await Promise.all(
    catalog.shards.map(async (name) => {
      const shard = (await readEntry<Shard>(name)) ?? { visits: [] };
      const visits = shard.visits.filter((visit) => !drop.has(visit.id));
      if (visits.length !== shard.visits.length) await writeEntry(name, { visits });
    }),
  );
}

export function parseAgent(ua: string) {
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /Chrome\//.test(ua)
      ? "Chrome"
      : /Firefox\//.test(ua)
        ? "Firefox"
        : /Safari\//.test(ua)
          ? "Safari"
          : "Other";
  const os = /Windows/.test(ua)
    ? "Windows"
    : /Android/.test(ua)
      ? "Android"
      : /iPhone|iPad/.test(ua)
        ? "iOS"
        : /Mac OS/.test(ua)
          ? "macOS"
          : /Linux/.test(ua)
            ? "Linux"
            : "Other";
  const device = /iPad|Tablet/i.test(ua) ? "tablet" : /Mobi|Android|iPhone/i.test(ua) ? "mobile" : "desktop";
  return { browser, os, device };
}

export function classifyVisit(ua: string, hostname: string): VisitClass {
  if (hostname === "localhost" || hostname === "127.0.0.1") return "test";
  if (/bot|spider|crawl|slurp|headless|preview|wget|curl|python-requests/i.test(ua)) return "bot";
  return "browser";
}

export async function lookupPlace() {
  const cached = sessionStorage.getItem("ecat-place");
  if (cached) return cached;
  try {
    const response = await fetch("https://get.geojs.io/v1/ip/geo.json", { cache: "no-store" });
    if (!response.ok) return "Unavailable";
    const data = (await response.json()) as { city?: string; region?: string; country?: string };
    const place = [data.city, data.region, data.country].filter(Boolean).join(", ") || "Unavailable";
    sessionStorage.setItem("ecat-place", place);
    return place;
  } catch {
    return "Unavailable";
  }
}

export function knownSection(id: string) {
  return sections.has(id) ? id : null;
}

function nyOffset(ms: number) {
  const zone = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    timeZoneName: "shortOffset",
  })
    .formatToParts(ms)
    .find((part) => part.type === "timeZoneName")?.value;
  const match = /GMT([+-]\d+)/.exec(zone ?? "");
  return (match ? Number(match[1]) : -4) * 60 * 60 * 1000;
}

function startOfNyDay(ms: number) {
  const offset = nyOffset(ms);
  return Math.floor((ms + offset) / 86400000) * 86400000 - offset;
}

function rangeBounds(filters: Filters, now: number): { from: number; to: number; unit: "hour" | "day" } {
  if (filters.range === "24h") return { from: now - 86400000, to: now, unit: "hour" };
  if (filters.range === "7d") return { from: startOfNyDay(now - 6 * 86400000), to: now, unit: "day" };
  if (filters.range === "custom") {
    const from = filters.from ? startOfNyDay(Date.parse(`${filters.from}T12:00:00Z`)) : startOfNyDay(now);
    const to = filters.to ? startOfNyDay(Date.parse(`${filters.to}T12:00:00Z`)) + 86400000 : now;
    return { from, to, unit: to - from > 2 * 86400000 ? "day" : "hour" };
  }
  return { from: startOfNyDay(now), to: now, unit: "hour" };
}

function allowed(visit: Visit, filters: Filters) {
  if (visit.classification === "bot" && !filters.bots) return false;
  if (visit.classification === "test" && !filters.tests) return false;
  if (filters.campaign && !`${visit.utmSource ?? ""} ${visit.utmMedium ?? ""} ${visit.utmCampaign ?? ""}`.toLowerCase().includes(filters.campaign.trim().toLowerCase())) {
    return false;
  }
  if (filters.referrer && !visit.referrer.toLowerCase().includes(filters.referrer.trim().toLowerCase())) return false;
  return true;
}

function labelFor(start: number, unit: "hour" | "day") {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: unit === "day" ? "short" : undefined,
    day: unit === "day" ? "numeric" : undefined,
    hour: unit === "hour" ? "numeric" : undefined,
  }).format(start);
}

export function summarize(visits: Visit[], filters: Filters, now = Date.now()): { summary: Summary; rows: Visit[] } {
  const bounds = rangeBounds(filters, now);
  const rows = visits
    .filter((visit) => allowed(visit, filters) && visit.startedAt < bounds.to && visit.lastSeen >= bounds.from)
    .sort((a, b) => b.startedAt - a.startedAt);
  const activeCut = now - 90 * 1000;
  const activeVisitors = new Set(
    visits.filter((visit) => allowed(visit, filters) && visit.lastSeen >= activeCut).map((visit) => visit.visitorId),
  ).size;
  const step = bounds.unit === "hour" ? 3600000 : 86400000;
  const first = bounds.unit === "hour" ? Math.floor(bounds.from / step) * step : startOfNyDay(bounds.from);
  const trend: Summary["trend"] = [];
  for (let start = first; start < bounds.to; start += step) {
    const end = start + step;
    const visitors = new Set(rows.filter((visit) => visit.startedAt < end && visit.lastSeen >= start).map((visit) => visit.visitorId)).size;
    trend.push({ start, label: labelFor(start, bounds.unit), visitors });
  }
  const clicks = { copy: 0, telegram: 0, x: 0, total: 0 };
  let pageViews = 0;
  for (const visit of rows) {
    pageViews += visit.pageViews.filter((view) => view.createdAt >= bounds.from && view.createdAt < bounds.to).length;
    for (const click of visit.clicks) {
      if (click.createdAt < bounds.from || click.createdAt >= bounds.to) continue;
      clicks[click.kind] += 1;
      clicks.total += 1;
    }
  }
  const referrals = new Map<string, number>();
  const campaigns = new Map<string, { source: string; medium: string; campaign: string; visits: number }>();
  for (const visit of rows) {
    const host = visit.referrer || "Direct";
    referrals.set(host, (referrals.get(host) ?? 0) + 1);
    if (visit.utmSource || visit.utmMedium || visit.utmCampaign) {
      const key = `${visit.utmSource ?? ""}|${visit.utmMedium ?? ""}|${visit.utmCampaign ?? ""}`;
      const current = campaigns.get(key) ?? {
        source: visit.utmSource ?? "",
        medium: visit.utmMedium ?? "",
        campaign: visit.utmCampaign ?? "",
        visits: 0,
      };
      current.visits += 1;
      campaigns.set(key, current);
    }
  }
  return {
    rows,
    summary: {
      activeVisitors,
      browserVisitors: new Set(rows.map((visit) => visit.visitorId)).size,
      visits: rows.length,
      pageViews,
      clicks,
      trend,
      trendUnit: bounds.unit,
      referrals: [...referrals.entries()].map(([host, count]) => ({ host, visits: count })).sort((a, b) => b.visits - a.visits).slice(0, 8),
      campaigns: [...campaigns.values()].sort((a, b) => b.visits - a.visits).slice(0, 8),
      generatedAt: now,
    },
  };
}

export function visitsToCsv(visits: Visit[]) {
  const header = ["id", "started", "last_seen", "location", "classification", "path", "section", "browser", "os", "device", "referrer", "campaign", "page_views", "clicks"];
  const lines = visits.map((visit) =>
    [
      visit.id,
      new Date(visit.startedAt).toISOString(),
      new Date(visit.lastSeen).toISOString(),
      visit.location,
      visit.classification,
      visit.path,
      visit.section ?? "",
      visit.browser,
      visit.os,
      visit.device,
      visit.referrer,
      visit.utmCampaign ?? "",
      String(visit.pageViews.length),
      String(visit.clicks.length),
    ]
      .map((value) => `"${value.replaceAll('"', '""')}"`)
      .join(","),
  );
  return [header.join(","), ...lines].join("\n");
}
