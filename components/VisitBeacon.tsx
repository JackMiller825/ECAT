"use client";

import { useEffect } from "react";
import {
  classifyVisit,
  isDashboardPath,
  knownSection,
  lookupPlace,
  parseAgent,
  upsertVisit,
  type ClickKind,
  type Visit,
} from "@/lib/visit-log";

const clickKinds = new Set<ClickKind>(["copy", "telegram", "x"]);

export default function VisitBeacon() {
  useEffect(() => {
    if (isDashboardPath(location.pathname)) return;
    let visit: Visit | null = null;
    let chain: Promise<void> = Promise.resolve();
    let stopped = false;

    const enqueue = (task: () => Promise<void>) => {
      chain = chain.then(task, task);
    };

    const persist = () => {
      if (!visit) return;
      const snapshot = {
        ...visit,
        pageViews: visit.pageViews.slice(-20),
        clicks: visit.clicks.slice(-20),
      };
      visit = snapshot;
      enqueue(async () => {
        await upsertVisit(snapshot);
      });
    };

    const agent = parseAgent(navigator.userAgent);
    const local = location.hostname === "localhost" || location.hostname === "127.0.0.1";
    const visitorKey = local ? "ecat-visitor-local" : "ecat-visitor";
    const visitKey = local ? "ecat-visit-local" : "ecat-visit";
    let visitorId = localStorage.getItem(visitorKey);
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem(visitorKey, visitorId);
    }
    let visitId = sessionStorage.getItem(visitKey);
    if (!visitId) {
      visitId = crypto.randomUUID();
      sessionStorage.setItem(visitKey, visitId);
    }
    const params = new URLSearchParams(location.search);
    const now = Date.now();
    visit = {
      id: visitId,
      visitorId,
      startedAt: now,
      lastSeen: now,
      path: `${location.pathname}${location.search}`,
      section: knownSection(location.hash.replace("#", "")) ?? "home",
      ...agent,
      referrer: (() => {
        try {
          return document.referrer ? new URL(document.referrer).host : "Direct";
        } catch {
          return "Direct";
        }
      })(),
      utmSource: params.get("utm_source"),
      utmMedium: params.get("utm_medium"),
      utmCampaign: params.get("utm_campaign"),
      classification: classifyVisit(navigator.userAgent, location.hostname),
      location: sessionStorage.getItem("ecat-place") || "Unavailable",
      pageViews: [{ path: `${location.pathname}${location.search}`, createdAt: now }],
      clicks: [],
    };
    persist();
    void lookupPlace().then((place) => {
      if (stopped || !visit || !place) return;
      visit = { ...visit, location: place };
      persist();
    });

    const onSection = (id: string) => {
      const section = knownSection(id);
      if (!visit || !section || visit.section === section) return;
      visit = { ...visit, section, lastSeen: Date.now() };
      persist();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible instanceof HTMLElement) onSection(visible.id);
      },
      { threshold: [0.35, 0.6] },
    );
    document.querySelectorAll("section[id]").forEach((node) => observer.observe(node));

    const onClick = (event: Event) => {
      const kind = (event as CustomEvent<ClickKind>).detail;
      if (!visit || !clickKinds.has(kind) || visit.clicks.some((click) => click.kind === kind)) return;
      visit = {
        ...visit,
        lastSeen: Date.now(),
        clicks: [...visit.clicks, { kind, createdAt: Date.now() }],
      };
      persist();
    };
    window.addEventListener("ecat-click", onClick);

    const beat = window.setInterval(() => {
      if (!visit || document.visibilityState === "hidden") return;
      visit = { ...visit, lastSeen: Date.now() };
      persist();
    }, 45000);

    return () => {
      stopped = true;
      observer.disconnect();
      window.removeEventListener("ecat-click", onClick);
      window.clearInterval(beat);
    };
  }, []);

  return null;
}
