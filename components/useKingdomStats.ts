"use client";

import { useEffect, useState } from "react";
import {
  emptyStats,
  isLocalHost,
  LOCAL_ROOM,
  LOCAL_VIEWS,
  LOCAL_VISITS,
  PRODUCTION_ROOM,
  PRODUCTION_VIEWS,
  PRODUCTION_VISITS,
  readCounter,
  type KingdomStats,
} from "@/lib/attendance";

export function useKingdomStats(record: boolean, enabled = true) {
  const [stats, setStats] = useState<KingdomStats>(emptyStats);

  useEffect(() => {
    if (!enabled) return;
    const local = isLocalHost(location.hostname);
    const room = local ? LOCAL_ROOM : PRODUCTION_ROOM;
    const visitsKey = local ? LOCAL_VISITS : PRODUCTION_VISITS;
    const viewsKey = local ? LOCAL_VIEWS : PRODUCTION_VIEWS;
    const visitFlag = local ? "ecat-visit-counted-local" : "ecat-visit-counted";
    let cancelled = false;
    let socket: WebSocket | null = null;
    let retry = 0;
    let failures = 0;
    let poll = 0;

    const uidKey = local ? "ecat-presence-id-local" : "ecat-presence-id";
    let uid = sessionStorage.getItem(uidKey);
    if (!uid) {
      uid = crypto.randomUUID();
      sessionStorage.setItem(uidKey, uid);
    }

    async function loadCount(
      key: string,
      action: "hit" | "get",
      field: "visits" | "pageViews",
      stateField: "visitState" | "pageViewState",
    ) {
      try {
        const value = await readCounter(key, action);
        if (!cancelled) {
          setStats((current) => ({
            ...current,
            [field]: value,
            [stateField]: "ready",
          }));
        }
      } catch {
        if (!cancelled) {
          setStats((current) => ({
            ...current,
            [stateField]: current[field] === null ? "unavailable" : current[stateField],
          }));
        }
      }
    }

    function connect() {
      if (cancelled || document.visibilityState === "hidden") return;
      const url = `wss://presence.hvalec.com/ws?room=${encodeURIComponent(room)}&uid=${encodeURIComponent(uid!)}`;
      socket = new WebSocket(url);
      socket.addEventListener("open", () => {
        failures = 0;
      });
      socket.addEventListener("message", (event) => {
        try {
          const message = JSON.parse(String(event.data)) as {
            type?: string;
            count?: number;
          };
          const count = message.count;
          if (
            (message.type === "presence" ||
              message.type === "welcome" ||
              message.type === "rank") &&
            typeof count === "number"
          ) {
            setStats((current) => ({
              ...current,
              live: count,
              liveState: "live",
            }));
          }
        } catch {
          /* Ignore malformed presence frames. */
        }
      });
      socket.addEventListener("close", () => {
        if (cancelled || document.visibilityState === "hidden") return;
        failures += 1;
        if (failures >= 4) {
          setStats((current) => ({ ...current, liveState: "unavailable" }));
          return;
        }
        retry = window.setTimeout(connect, 1600);
      });
    }

    function onVisibility() {
      if (document.visibilityState === "hidden") {
        window.clearTimeout(retry);
        socket?.close();
        return;
      }
      failures = 0;
      connect();
    }

    const alreadyVisited = sessionStorage.getItem(visitFlag) === "1";
    if (record && !alreadyVisited) sessionStorage.setItem(visitFlag, "1");
    void loadCount(visitsKey, record && !alreadyVisited ? "hit" : "get", "visits", "visitState");
    void loadCount(viewsKey, record ? "hit" : "get", "pageViews", "pageViewState");
    connect();
    poll = window.setInterval(() => {
      void loadCount(visitsKey, "get", "visits", "visitState");
      void loadCount(viewsKey, "get", "pageViews", "pageViewState");
    }, record ? 20000 : 10000);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      window.clearTimeout(retry);
      window.clearInterval(poll);
      document.removeEventListener("visibilitychange", onVisibility);
      socket?.close();
    };
  }, [record, enabled]);

  return stats;
}
