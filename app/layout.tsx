import type { Metadata } from "next";
import "./globals.css";
import { asset } from "@/lib/config";
export const metadata: Metadata = {
  ...(process.env.NEXT_PUBLIC_SITE_URL
    ? { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL) }
    : {}),
  title: "Ethercat · Ethereum found its cat.",
  description:
    "A cardboard-box cat accidentally becomes king. Enter the crystal kingdom, explore the royal story, and collect deeply unserious memes.",
  openGraph: {
    title: "Ethercat · Ethereum found its cat.",
    description: "A meme. A kingdom. An alarming amount of paperwork.",
    ...(process.env.NEXT_PUBLIC_SITE_URL
      ? { images: [asset("brand/ecat-banner.png")] }
      : {}),
  },
  icons: { icon: asset("effects/ecat-paw.svg") },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">
          Skip to the kingdom
        </a>
        {children}
      </body>
    </html>
  );
}
