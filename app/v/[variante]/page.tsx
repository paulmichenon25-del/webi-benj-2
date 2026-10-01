import { notFound } from "next/navigation";
import { Landing } from "@/components/Landing";
import { IDS_VARIANTES, VARIANTES, estVariante } from "@/content/variantes";

// Chaque variante a aussi sa propre URL (/v/a, /v/b, /v/c) : pratique pour la
// prévisualiser, ou pour l'envoyer directement depuis une pub précise.
export function generateStaticParams() {
  return IDS_VARIANTES.map((variante) => ({ variante }));
}

export default async function PageVariante({ params }: { params: Promise<{ variante: string }> }) {
  const { variante } = await params;
  if (!estVariante(variante)) notFound();
  return <Landing variante={VARIANTES[variante]} />;
}
