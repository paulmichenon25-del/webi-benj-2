import type { Metadata, Viewport } from "next";
import { Anton, Inter } from "next/font/google";
import { MetaPixel } from "@/components/MetaPixel";
import "./globals.css";

const titre = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-titre",
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
    <html lang="fr" className={`${titre.variable} ${texte.variable}`}>
      <body>
        {children}
        <MetaPixel />
      </body>
    </html>
  );
}
