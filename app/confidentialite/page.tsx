import type { Metadata } from "next";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = { title: "Politique de confidentialité · FineArt Académie", robots: { index: false } };

// [CONTENU À FOURNIR : texte juridique, ou remplacer les liens du footer par les pages existantes du site]
export default function Page() {
  return (
    <>
      <main className="section">
        <div className="conteneur etroit">
          <h1 style={{ fontSize: "2rem", marginBottom: 20 }}>Politique de confidentialité</h1>
          <p>
            <span className="a-valider">[CONTENU À FOURNIR : Politique de confidentialité]</span>
          </p>
          <p>
            <a href="/">Retour à la page du live</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
