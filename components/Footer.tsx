import Art from "./Art";

export default function Footer() {
  return (
    <footer>
      <div className="footer-brand">
        <Art
          file="brand/ecat-logo-transparent"
          width={512}
          height={512}
          alt="Ethercat circular logo"
        />
        <a className="wordmark" href="#home">
          Ethercat<small>$ECAT · Ethereum</small>
        </a>
      </div>
      <nav aria-label="Footer navigation">
        <a href="#accident">The Accident</a>
        <a href="#royal-affairs">Royal Affairs</a>
        <a href="#vault">The Vault</a>
        <a href="#gallery">Memes</a>
        <a href="#court">The Court</a>
      </nav>
      <p>
        Ethercat is an independent meme project on Ethereum. No affiliation with
        the Ethereum Foundation or Catcoin is implied.
        <br />
        Memecoin prices are volatile. No returns are promised.
      </p>
    </footer>
  );
}
