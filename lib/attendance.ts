export const PRODUCTION_ROOM = "jackmiller825-ecat";
export const LOCAL_ROOM = "jackmiller825-ecat-local";
export const PRODUCTION_VISITS = "ethercat-kingdom/ecat-visits";
export const LOCAL_VISITS = "ethercat-kingdom/ecat-visits-local";
export const PRODUCTION_VIEWS = "ethercat-kingdom/ecat-pageviews";
export const LOCAL_VIEWS = "ethercat-kingdom/ecat-pageviews-local";

export type CountState = "loading" | "ready" | "unavailable";
export type LiveState = "loading" | "live" | "unavailable";

export type KingdomStats = {
  live: number | null;
  visits: number | null;
  pageViews: number | null;
  liveState: LiveState;
  visitState: CountState;
  pageViewState: CountState;
};

export const emptyStats: KingdomStats = {
  live: null,
  visits: null,
  pageViews: null,
  liveState: "loading",
  visitState: "loading",
  pageViewState: "loading",
};

export function isLocalHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export function counterUrl(key: string, action: "hit" | "get") {
  return `https://abacus.jasoncameron.dev/${action}/${key}`;
}

export async function readCounter(key: string, action: "hit" | "get") {
  const response = await fetch(counterUrl(key, action));
  if (!response.ok) throw new Error("counter unavailable");
  const data = (await response.json()) as { value?: number };
  if (typeof data.value !== "number") throw new Error("counter unavailable");
  return data.value;
}
