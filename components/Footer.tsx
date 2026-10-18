import Art from "./Art";

export default function Footer() {
  return (
    <footer>
      <a className="footer-brand wordmark" href="#home">
        <Art
          file="brand/ecat-logo-transparent"
          width={512}
          height={512}
          alt=""
        />
        <span>
          Ethercat<small>$ECAT · Ethereum</small>
        </span>
      </a>
      <nav aria-label="Footer navigation">
        <a href="#accident">The Accident</a>
        <a href="#royal-affairs">Royal Affairs</a>
        <a href="#vault">The Vault</a>
        <a href="#gallery">Memes</a>
        <a href="#court">The Court</a>
      </nav>
    </footer>
  );
}
