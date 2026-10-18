"use client";
import { useState } from "react";
import { asset, officialUrl, token } from "@/lib/config";
export function OfficialLink({
  kind,
  className = "button",
}: {
  kind: "telegram" | "x" | "swap";
  className?: string;
}) {
  const url = officialUrl(token[kind]);
  const labels = {
    telegram: "Join our Telegram",
    x: "Follow on X",
    swap: "Open official swap",
  };
  return url ? (
    <a
      className={className}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {labels[kind]} ↗
    </a>
  ) : (
    <span className={className + " unavailable"} aria-disabled="true">
      {kind === "x" ? "X" : kind === "swap" ? "Swap" : "Telegram"} · Coming soon
    </span>
  );
}
const crystalMessages = [
  "The crystal is waiting.",
  "The lights flickered.",
  "Reality is becoming suspicious.",
  "The portal is open.",
];

export function CrystalGame() {
  const [taps, setTaps] = useState(0);
  return (
    <div className={"crystal-game stage-" + taps}>
      <div className="crystal-stage">
        <img
          className="portal-ring"
          src={asset("effects/ecat-portal-ring.svg")}
          width={180}
          height={180}
          alt=""
        />
        <img
          className="crystal"
          src={asset("effects/ecat-diamond.svg")}
          width={85}
          height={105}
          alt=""
        />
      </div>
      <button
        className="button"
        type="button"
        onClick={() => setTaps((n) => Math.min(3, n + 1))}
      >
        {taps === 3 ? "Portal open" : "Tap the shiny thing"}
      </button>
      <div className="tap-progress" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <i key={n} className={taps >= n ? "lit" : ""} />
        ))}
      </div>
      <p role="status">{crystalMessages[taps]}</p>
      {taps === 3 ? (
        <a className="text-link" href="#royal-affairs">
          Step through the portal →
        </a>
      ) : null}
      {taps > 0 ? (
        <button className="text-link reset" type="button" onClick={() => setTaps(0)}>
          Reset the crystal
        </button>
      ) : null}
    </div>
  );
}
const decrees = [
  [
    "☀ Sunbeams",
    "Every sunbeam is public napping property.",
    "Meetings scheduled during sunshine are postponed until further notice.",
  ],
  [
    "♜ Closed Doors",
    "All closed doors are hereby abolished.",
    "The king may enter. The king may leave. The king may stand in the doorway deciding for forty minutes.",
  ],
  [
    "♛ Empty Bowls",
    "All empty bowls are national emergencies.",
    "Even if the bowl was filled eleven minutes earlier. Especially then.",
  ],
];
export function Decrees() {
  const [active, setActive] = useState(0);
  return (
    <>
      <div className="decree-tabs" role="tablist" aria-label="Royal decrees">
        {decrees.map(([name], i) => (
          <button
            key={name}
            id={"decree-tab-" + i}
            role="tab"
            aria-selected={i === active}
            aria-controls="decree-panel"
            tabIndex={i === active ? 0 : -1}
            type="button"
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
                e.preventDefault();
                const next =
                  e.key === "Home"
                    ? 0
                    : e.key === "End"
                      ? 2
                      : (active + (e.key === "ArrowRight" ? 1 : 2)) % 3;
                setActive(next);
                document.getElementById("decree-tab-" + next)?.focus();
              }
            }}
          >
            {name}
          </button>
        ))}
      </div>
      <div
        id="decree-panel"
        className="decree-panel"
        role="tabpanel"
        aria-labelledby={"decree-tab-" + active}
        tabIndex={0}
      >
        <h3>{decrees[active][1]}</h3>
        <p>{decrees[active][2]}</p>
      </div>
    </>
  );
}
