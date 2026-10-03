import { Footer } from "./Footer";
import styles from "./PageLegale.module.css";

export function PageLegale({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <>
      <main className={styles.page}>
        <div className="conteneur etroit">
          <a href="/" className={styles.retour}>← Retour à la page du live</a>
          <h1 className={styles.titre}>{titre}</h1>
          <div className={styles.texte}>{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
