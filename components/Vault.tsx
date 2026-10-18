"use client";
import { useState } from "react";
import { asset, token, officialUrl } from "@/lib/config";
import Art from "./Art";
export default function Vault() {
  const [message, setMessage] = useState("");
  const valid = /^0x[0-9a-fA-F]{40}$/.test(token.contractAddress);
  async function copy() {
    try {
      await navigator.clipboard.writeText(token.contractAddress);
      setMessage("Contract copied.");
    } catch {
      setMessage("Copy unavailable. Select the address manually.");
    }
  }
  return (
    <section className="vault section" id="vault" aria-labelledby="vault-title">
      <Art
        file="scenes/ecat-treasury"
        alt=""
        width={1536}
        height={1024}
        pictureClassName="bg-picture"
        className="scene-bg"
      />
      <div className="vault-shade" aria-hidden="true" />
      <div className="section-heading">
        <p className="eyebrow">The kingdom, by the numbers</p>
        <h2 id="vault-title" className="silver">
          The royal vault
        </h2>
        <p>Even a deeply unserious king keeps a clear inventory.</p>
      </div>
      <div className="stat-grid">
        <article>
          <img
            src={asset("effects/ecat-diamond.svg")}
            width={60}
            height={70}
            alt=""
          />
          <h3>Royal inventory</h3>
          <strong>{token.supply}</strong>
          <span>$ECAT total supply</span>
        </article>
        <article>
          <span className="stat-icon">%</span>
          <h3>The king’s cut</h3>
          <strong>{token.tax}</strong>
          <span>Token tax</span>
        </article>
        {[
          {
            label: "The foundation",
            value: "LP Burn",
            icon: "♨",
            data: token.lp,
          },
          {
            label: "Control of the crown",
            value: "Renounce",
            icon: "♛",
            data: token.ownership,
          },
        ].map((stat) => (
          <article key={stat.label}>
            <span className="stat-icon">{stat.icon}</span>
            <h3>{stat.label}</h3>
            <strong>{stat.value}</strong>
            <span>{stat.data.status}</span>
            {officialUrl(stat.data.evidence) && (
              <a
                href={stat.data.evidence}
                target="_blank"
                rel="noopener noreferrer"
              >
                View evidence ↗
              </a>
            )}
          </article>
        ))}
      </div>
      <div className="contract-bar">
        <span>CA:</span>
        <code>{valid ? token.contractAddress : "Coming Soon.."}</code>
        <button type="button" onClick={copy} disabled={!valid}>
          Copy CA
        </button>
      </div>
      <p className="status-note" role="status">
        {message ||
          "Burn and renunciation are planned until confirmed on-chain."}
      </p>
    </section>
  );
}
