"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function HeroMascot({ children }: { children: ReactNode }) {
  const tilt = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = tilt.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");
    if (reduce.matches || !fine.matches || window.innerWidth < 900) return;

    const onMove = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      const rotateY = Math.max(-3, Math.min(3, x * 6));
      const rotateX = Math.max(-3, Math.min(3, -y * 6));
      node.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    };
    const reset = () => {
      node.style.transform = "";
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("blur", reset);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", reset);
    };
  }, []);

  return (
    <div className="hero-cat-slot">
      <div className="hero-cat-float">
        <div className="hero-cat-tilt" ref={tilt}>
          {children}
        </div>
      </div>
    </div>
  );
}
