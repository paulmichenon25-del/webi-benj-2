import type { Metadata, Viewport } from "next";
import { Anton, Inter, Playfair_Display } from "next/font/google";
import { MetaPixel } from "@/components/MetaPixel";
import "./globals.css";

// Titres : serif élégante (version validée par Paul). Anton : dates et chiffres,
// comme sur la page du live de juillet.
const titre = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-titre",
  display: "swap",
});

const impact = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-impact",
  display: "swap",
});

const texte = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-texte",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Vivre du boudoir, toute l'année · 2 soirées de live gratuites avec Benjamin",
  description:
    "Les 18 et 19 octobre à 20h, je te montre en direct comment trouver tes clientes boudoir, construire ton offre et la vendre au bon prix pour en vivre toute l'année.",
  openGraph: {
    title: "Vivre du boudoir, toute l'année",
    description: "2 soirées de live gratuites avec Benjamin Hanachowicz · 18 et 19 octobre · 20h",
    locale: "fr_FR",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7e4418",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${titre.variable} ${impact.variable} ${texte.variable}`}>
      <body>
        {children}
        <MetaPixel />
      </body>
    </html>
  );
}
