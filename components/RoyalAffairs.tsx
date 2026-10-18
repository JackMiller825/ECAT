import Art from "./Art";
import { Decrees } from "./Interactions";

export default function RoyalAffairs() {
  return (
    <section className="affairs" id="royal-affairs" aria-labelledby="portal-title">
      <div className="portal-row">
        <figure>
          <Art
            file="scenes/ecat-story-02-portal"
            width={1536}
            height={1024}
            alt="Ethercat leaps after a diamond through a violet portal, followed by socks and a cardboard box"
          />
        </figure>
        <div className="story-copy">
          <p className="eyebrow">Chapter 02 · The shiny thing</p>
          <h2 id="portal-title" className="silver">
            One small pounce.
            <br />
            One enormous administrative problem.
          </h2>
          <span className="flourish">── ◇ ──</span>
          <p>
            The diamond escaped through a violet doorway. Ethercat followed with
            the confidence of a creature who had never paid rent. A sock, two
            receipts, and his favorite box followed behind him.
          </p>
          <p>
            <em>The laws of physics submitted a complaint.</em>
          </p>
          <p>
            On the other side lay floating castles, crystal waterfalls, and a
            moon so large it looked like somebody had forgotten to resize it. In
            the center stood a throne. Ethercat sat on it immediately. This was
            interpreted as a coronation.
          </p>
          <p>
            He attempted to explain that he was only looking for the shiny
            thing. Unfortunately, his explanation sounded like meow, which the
            ancient royal council translated as a bold new constitutional vision.
          </p>
          <a className="text-link" href="#throne">
            Meet the management ↓
          </a>
        </div>
      </div>
      <div className="chapter-break" aria-hidden="true">
        <span>── ◇ ──</span>
      </div>
      <div className="throne-row" id="throne">
        <figure>
          <Art
            file="scenes/ecat-story-03-throne"
            width={1536}
            height={1024}
            alt="Ethercat lounges on a royal throne while unread paperwork covers the floor"
          />
        </figure>
        <div className="story-copy">
          <p className="eyebrow">Chapter 03 · Royal affairs</p>
          <h2 className="silver">
            His Majesty
            <br />
            is unavailable.
          </h2>
          <span className="flourish">── ◇ ──</span>
          <p>
            The kingdom presented its urgent affairs. A bridge needed repairing.
            A dragon had parked illegally. Someone wanted a committee to
            investigate the previous committee.
          </p>
          <p>
            Ethercat knocked the documents off the table and went to sleep.{" "}
            <strong>The court called it decisive leadership.</strong>
          </p>
          <p>
            His first decree required every sunbeam to be available for public
            napping. His second abolished closed doors. His third demanded that
            all empty bowls be treated as national emergencies, even if they had
            been filled eleven minutes earlier.
          </p>
          <Decrees />
          <p>
            He was offered a crown. He wore it for four seconds, attacked its
            reflection, and pushed it into a fountain. The crown is now
            considered a sacred underwater relic.
          </p>
          <p>
            By sunset, Ethercat had achieved what generations of rulers could
            not: every citizen was discussing the same thing. Was the king a
            genius, or just a cat? Ethercat declined to comment because a moth
            had entered the room.
          </p>
        </div>
      </div>
    </section>
  );
}
