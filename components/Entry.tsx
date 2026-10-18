import { asset } from "@/lib/config";
import { OfficialLink } from "./Interactions";

const steps = [
  {
    title: "Open your wallet.",
    icon: "wallet",
    copy: "Create or open an Ethereum-compatible wallet. Keep the recovery phrase private.",
  },
  {
    title: "Bring ETH.",
    icon: "diamond",
    copy: "Bring ETH on Ethereum mainnet and retain ETH for fees.",
  },
  {
    title: "Verify the contract.",
    icon: "seal",
    copy: "Verify the exact official contract before swapping anything.",
  },
  {
    title: "Make the swap.",
    icon: "swap",
    copy: "Review and make the swap through the configured official link.",
  },
];

export default function Entry() {
  return (
    <section className="entry section" id="entry" aria-labelledby="entry-title">
      <div className="section-heading">
        <p className="eyebrow">Four pawprints</p>
        <h2 id="entry-title" className="silver">
          Crossing into the kingdom
        </h2>
        <p>Bring ETH. Check the contract. Mind the cat.</p>
      </div>
      <div className="steps">
        <svg className="paw-path" viewBox="0 0 1200 90" aria-hidden="true">
          <path d="M30 58 C 160 8, 250 82, 390 42 S 620 6, 790 48 S 980 86, 1170 28" />
        </svg>
        {steps.map((step, index) => (
          <article key={step.title}>
            <span className="step-number">{index + 1}</span>
            {step.icon === "diamond" ? (
              <img
                src={asset("effects/ecat-diamond.svg")}
                width={66}
                height={66}
                alt=""
              />
            ) : step.icon === "wallet" ? (
              <img src={asset("effects/ecat-paw.svg")} width={66} height={66} alt="" />
            ) : (
              <span className="step-icon" aria-hidden="true">
                {step.icon === "seal" ? "⌕" : "⇄"}
              </span>
            )}
            <h3>{step.title}</h3>
            <p>{step.copy}</p>
            {step.icon === "swap" ? (
              <OfficialLink kind="swap" className="button small" />
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
