import Art from "./Art";
import { CrystalGame } from "./Interactions";

export default function Origin() {
  return (
    <section
      className="origin section"
      id="accident"
      aria-labelledby="origin-title"
    >
      <div className="chapter-strip">
        <span>01 · The Accident</span>
        <span>02 · The Shiny Thing</span>
        <span>03 · Royal Affairs</span>
      </div>
      <div className="parchment">
        <div className="origin-copy">
          <p className="eyebrow">Chapter 01</p>
          <h2 id="origin-title">
            The box was
            <br />
            already a palace.
          </h2>
          <span className="flourish">── ◇ ──</span>
          <p>
            Ethercat had everything a cat could want: three expensive beds he
            refused to touch, a water fountain he considered suspicious, and a
            cardboard box with excellent structural integrity.
          </p>
          <p>
            His human called it packaging.{" "}
            <strong>Ethercat called it ancestral property.</strong>
          </p>
          <p>
            One evening a little purple diamond appeared under the sofa. It
            glowed. It floated. It made a faint humming noise. Naturally,
            Ethercat concluded that it was a toy and that somebody else should
            be blamed for whatever happened next.
          </p>
          <p>
            He tapped it once. The lights flickered. He tapped it twice. A hole
            opened in reality. He tapped it a third time because cats do not
            read warning labels, especially labels written in the fabric of
            spacetime.
          </p>
        </div>
        <figure className="origin-picture">
          <Art
            file="scenes/ecat-story-01-box"
            width={1536}
            height={1024}
            alt="Ethercat chooses a battered cardboard box over elaborate cat beds"
          />
          <figcaption>
            Ancestral property.
            <br />
            Do not recycle.
          </figcaption>
        </figure>
      </div>
      <CrystalGame />
    </section>
  );
}
