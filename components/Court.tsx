import { asset } from "@/lib/config";
import Art from "./Art";
import { OfficialLink } from "./Interactions";

export default function Court() {
  return (
    <section className="court" id="court" aria-labelledby="court-title">
      <Art
        file="scenes/ecat-community"
        alt="Ethercat curled beside a cardboard box on a balcony above the crystal kingdom"
        width={1536}
        height={1024}
        pictureClassName="bg-picture"
        className="scene-bg court-scene"
      />
      <div className="court-shade" aria-hidden="true" />
      <div className="court-copy">
        <p className="eyebrow">Enter the court</p>
        <h2 id="court-title" className="silver">
          Every kingdom
          <br />
          needs questionable
          <br />
          company.
        </h2>
        <p>
          Bring your memes. Bring your cat pictures.
          <br />
          Leave the royal paperwork to absolutely nobody.
        </p>
        <div className="court-portal">
          <img
            className="court-ring"
            src={asset("effects/ecat-portal-ring.svg")}
            width={160}
            height={160}
            alt=""
          />
          <OfficialLink kind="telegram" className="button primary" />
          <OfficialLink kind="x" className="button" />
          <small>Membership requirements: tolerate the cat.</small>
        </div>
      </div>
    </section>
  );
}
