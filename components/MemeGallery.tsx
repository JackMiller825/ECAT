"use client";

import { useEffect, useRef, useState } from "react";
import { asset, memes } from "@/lib/config";
import Art from "./Art";

const pngFor = (id: string) => asset(`memes/ecat-meme-${id}.png`);

export default function MemeGallery() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const dragStart = useRef<number | null>(null);
  const meme = memes[selected];
  const showFeatured = filter === "all" || filter === "royal";

  function show(index: number, button: HTMLButtonElement) {
    opener.current = button;
    setSelected(index);
    setOpen(true);
  }

  function step(direction: number) {
    setSelected((current) => (current + direction + memes.length) % memes.length);
  }

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
  }, [open]);

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    const onClose = () => {
      const target = opener.current;
      setOpen(false);
      window.setTimeout(() => target?.focus(), 0);
    };
    node.addEventListener("close", onClose);
    return () => node.removeEventListener("close", onClose);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!dialog.current?.open) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="gallery section" id="gallery" aria-labelledby="gallery-title">
      <div className="section-heading">
        <p className="eyebrow">Ether ◇ Cat</p>
        <h2 id="gallery-title" className="silver">
          The royal expressions department.
        </h2>
        <p>Official statements from a deeply unserious monarch.</p>
      </div>
      <div className="filters" role="group" aria-label="Filter memes">
        {[
          ["all", "All moods"],
          ["royal", "Royal behavior"],
          ["bowl", "Bowl emergencies"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={filter === id ? "active" : ""}
            aria-pressed={filter === id}
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="gallery-layout">
        <div className="meme-grid">
          {memes.map((item, index) =>
            filter === "all" || item.category === filter ? (
              <article className="meme-card" key={item.id}>
                <button
                  className="meme-open"
                  type="button"
                  onClick={(event) => show(index, event.currentTarget)}
                  aria-label={`Preview ${item.title}`}
                >
                  <Art
                    file={`memes/ecat-meme-${item.id}`}
                    width={1254}
                    height={1254}
                    alt={item.title}
                  />
                </button>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.caption}</p>
                  <a
                    className="download"
                    href={pngFor(item.id)}
                    download={`ecat-meme-${item.id}.png`}
                    aria-label={`Download ${item.title}`}
                  >
                    ↓
                  </a>
                </div>
              </article>
            ) : null,
          )}
        </div>
        {showFeatured ? (
          <aside className="featured-meme">
            <button
              className="meme-open"
              type="button"
              onClick={(event) => show(4, event.currentTarget)}
              aria-label="Preview tired Ethercat"
            >
              <Art
                file="memes/ecat-meme-05-tired"
                width={1254}
                height={1254}
                alt="Exhausted Ethercat resting on royal paperwork"
              />
            </button>
            <div>
              <h3>Another meeting that could have been a nap.</h3>
              <a
                className="download"
                href={pngFor("05-tired")}
                download="ecat-meme-05-tired.png"
                aria-label="Download tired Ethercat"
              >
                ↓
              </a>
            </div>
          </aside>
        ) : null}
      </div>
      <dialog
        ref={dialog}
        aria-labelledby="meme-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          dragStart.current = event.clientX;
        }}
        onPointerUp={(event) => {
          if (dragStart.current === null) return;
          const delta = event.clientX - dragStart.current;
          dragStart.current = null;
          if (Math.abs(delta) < 48) return;
          step(delta < 0 ? 1 : -1);
        }}
      >
        {open ? (
          <>
            <button
              className="dialog-close"
              type="button"
              onClick={() => dialog.current?.close()}
              aria-label="Close meme preview"
            >
              ×
            </button>
            <Art
              file={`memes/ecat-meme-${meme.id}`}
              width={1254}
              height={1254}
              alt={meme.title}
              priority
            />
            <h2 id="meme-title">{meme.caption}</h2>
            <div className="dialog-actions">
              <button type="button" aria-label="Previous meme" onClick={() => step(-1)}>
                ←
              </button>
              <a
                className="button small"
                href={pngFor(meme.id)}
                download={`ecat-meme-${meme.id}.png`}
              >
                Download PNG
              </a>
              <button type="button" aria-label="Next meme" onClick={() => step(1)}>
                →
              </button>
            </div>
          </>
        ) : null}
      </dialog>
    </section>
  );
}
