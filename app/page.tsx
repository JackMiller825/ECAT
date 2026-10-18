import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Origin from "@/components/Origin";
import RoyalAffairs from "@/components/RoyalAffairs";
import Vault from "@/components/Vault";
import Entry from "@/components/Entry";
import MemeGallery from "@/components/MemeGallery";
import Court from "@/components/Court";
import VisitorTracker from "@/components/VisitorTracker";
import Footer from "@/components/Footer";
export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Origin />
        <RoyalAffairs />
        <Vault />
        <Entry />
        <MemeGallery />
        <Court />
        <VisitorTracker />
      </main>
      <Footer />
    </>
  );
}
