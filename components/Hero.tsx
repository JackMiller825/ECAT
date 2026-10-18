import ReactDOM from "react-dom";
import { asset } from "@/lib/config";
import Art from "./Art";
import HeroMascot from "./HeroMascot";

const sparkles = [
  { top: "16%", left: "63%", size: 22, delay: "0s" },
  { top: "30%", left: "84%", size: 34, delay: "1.3s" },
  { top: "58%", left: "57%", size: 16, delay: "2.1s" },
  { top: "74%", left: "90%", size: 26, delay: "0.7s" },
];

export default function Hero() {
  ReactDOM.preload(asset("scenes/ecat-hero-kingdom.webp"), {
    as: "image",
    fetchPriority: "high",
  });

  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <Art
        file="scenes/ecat-hero-kingdom"
        alt=""
        width={1536}
        height={1024}
        pictureClassName="bg-picture"
        className="scene-bg hero-scene"
        priority
      />
      <div className="hero-shade" aria-hidden="true" />
      <div className="sparkles" aria-hidden="true">
        {sparkles.map((spark) => (
          <img
            key={`${spark.top}-${spark.left}`}
            src={asset("effects/ecat-sparkle.svg")}
            alt=""
            width={spark.size}
            height={spark.size}
            style={{
              top: spark.top,
              left: spark.left,
              width: spark.size,
              animationDelay: spark.delay,
            }}
          />
        ))}
      </div>
      <div className="hero-copy">
        <p className="eyebrow">A small cat. An unreasonable kingdom.</p>
        <h1 id="hero-title" className="silver">
          Ethereum
          <br />
          found its cat.
        </h1>
        <p>
          He came for the shiny thing.
          <br />
          He stayed because everyone called him <strong>Your Majesty.</strong>
        </p>
        <div className="actions">
          <a className="button primary" href="#accident">
            ♛ Enter the kingdom <span>→</span>
          </a>
          <a className="button" href="#court">
            Join the court <span>→</span>
          </a>
        </div>
      </div>
      <HeroMascot>
        <Art
          file="characters/ecat-mascot-cutout"
          alt="Silver-white Ethercat with violet eyes, crystalline ears, and an Ethereum diamond pendant, holding another glowing diamond"
          width={1024}
          height={1536}
          className="hero-cat"
          priority
        />
      </HeroMascot>
      <a className="scroll-cue" href="#accident">
        <span>↓</span>
        Scroll to explore
        <small>01</small>
      </a>
    </section>
  );
}
