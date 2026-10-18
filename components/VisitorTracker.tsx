"use client";

import { useEffect, useState } from "react";

const PRODUCTION_ROOM = "jackmiller825-ecat";
const LOCAL_ROOM = "jackmiller825-ecat-local";
const PRODUCTION_COUNTER = "ethercat-kingdom/ecat-visits";
const LOCAL_COUNTER = "ethercat-kingdom/ecat-visits-local";

type Attendance = {
  live: number | null;
  visits: number | null;
  liveState: "loading" | "live" | "unavailable";
  visitState: "loading" | "ready" | "unavailable";
};

const initial: Attendance = {
  live: null,
  visits: null,
  liveState: "loading",
  visitState: "loading",
};

function counterUrl(key: string, action: "hit" | "get") {
  return `https://abacus.jasoncameron.dev/${action}/${key}`;
}

export default function VisitorTracker() {
  const [attendance, setAttendance] = useState<Attendance>(initial);

  useEffect(() => {
    const local =
      location.hostname === "localhost" || location.hostname === "127.0.0.1";
    const room = local ? LOCAL_ROOM : PRODUCTION_ROOM;
    const counter = local ? LOCAL_COUNTER : PRODUCTION_COUNTER;
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

    async function readVisits(action: "hit" | "get") {
      const response = await fetch(counterUrl(counter, action));
      if (!response.ok) throw new Error("counter unavailable");
      const data = (await response.json()) as { value?: number };
      if (typeof data.value !== "number") throw new Error("counter unavailable");
      return data.value;
    }

    async function recordVisit() {
      try {
        const already = sessionStorage.getItem(visitFlag) === "1";
        const value = await readVisits(already ? "get" : "hit");
        if (!already) sessionStorage.setItem(visitFlag, "1");
        if (!cancelled) {
          setAttendance((current) => ({
            ...current,
            visits: value,
            visitState: "ready",
          }));
        }
      } catch {
        if (!cancelled) {
          setAttendance((current) => ({ ...current, visitState: "unavailable" }));
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
          if (
            (message.type === "presence" ||
              message.type === "welcome" ||
              message.type === "rank") &&
            typeof message.count === "number"
          ) {
            setAttendance((current) => ({
              ...current,
              live: message.count ?? null,
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
          setAttendance((current) => ({ ...current, liveState: "unavailable" }));
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

    void recordVisit();
    connect();
    poll = window.setInterval(() => {
      void readVisits("get")
        .then((value) => {
          if (!cancelled) {
            setAttendance((current) => ({
              ...current,
              visits: value,
              visitState: "ready",
            }));
          }
        })
        .catch(() => {
          if (!cancelled) {
            setAttendance((current) => ({
              ...current,
              visitState: current.visits === null ? "unavailable" : current.visitState,
            }));
          }
        });
    }, 20000);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      window.clearTimeout(retry);
      window.clearInterval(poll);
      document.removeEventListener("visibilitychange", onVisibility);
      socket?.close();
    };
  }, []);

  const liveText =
    attendance.liveState === "live" && attendance.live !== null
      ? `${attendance.live} in the kingdom now`
      : attendance.liveState === "unavailable"
        ? "Live attendance unavailable"
        : "Counting the court…";
  const visitText =
    attendance.visitState === "ready" && attendance.visits !== null
      ? `${attendance.visits.toLocaleString("en-US")} visits recorded`
      : attendance.visitState === "unavailable"
        ? "Visit total unavailable"
        : "Visit total updating…";

  return (
    <section className="attendance" aria-label="Kingdom attendance">
      <p className="eyebrow">Court attendance</p>
      <p className="attendance-live">{liveText}</p>
      <p className="attendance-total">{visitText}</p>
      <p className="attendance-note">
        Anonymous session counts only. This page does not collect wallets,
        names, or personal details.
      </p>
    </section>
  );
}
