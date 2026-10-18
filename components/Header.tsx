"use client";

import { useEffect, useState } from "react";
import { asset } from "@/lib/config";

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="header">
      <a className="wordmark" href="#home">
        <img
          src={asset("effects/ecat-diamond.svg")}
          width={26}
          height={32}
          alt=""
        />
        <span>
          Ethercat<small>$ECAT</small>
        </span>
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="navigation"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Close" : "Menu"}
      </button>
      <nav
        id="navigation"
        className={open ? "open" : ""}
        aria-label="Main navigation"
        onClick={() => setOpen(false)}
      >
        <a href="#accident">The Accident</a>
        <a href="#royal-affairs">Royal Affairs</a>
        <a href="#vault">The Vault</a>
        <a className="button small" href="#court">
          ♛ Enter the Court
        </a>
      </nav>
    </header>
  );
}
