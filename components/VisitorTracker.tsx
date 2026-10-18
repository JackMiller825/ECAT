"use client";

import { useKingdomStats } from "./useKingdomStats";

export default function VisitorTracker() {
  useKingdomStats(true);
  return null;
}
