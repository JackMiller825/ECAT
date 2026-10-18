"use client";
import { useState } from "react";
import { asset, token, officialUrl } from "@/lib/config";
import Art from "./Art";
function displayedContract(address: string) {
  return /^0x[0-9a-fA-F]{40}$/.test(address) ? address : "Coming Soon..";
}

function copyText(value: string) {
  const area = document.createElement("textarea");
  area.value = value;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.top = "0";
  area.style.left = "0";
  area.style.fontSize = "16px";
  document.body.appendChild(area);
  area.focus();
  area.select();
  area.setSelectionRange(0, value.length);
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }
  area.remove();
  if (copied) return Promise.resolve(true);
  if (!navigator.clipboard?.writeText) return Promise.resolve(false);
  return navigator.clipboard.writeText(value).then(
    () => true,
    () => false,
  );
}

export default function Vault() {
  const [message, setMessage] = useState("");
  const shown = displayedContract(token.contractAddress);
  function copy() {
    void copyText(shown).then((copied) => {
      setMessage(copied ? "Contract copied." : "Copy unavailable. Select the address manually.");
    });
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
        <code>{shown}</code>
        <button type="button" onClick={copy}>
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
