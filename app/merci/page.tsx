import type { Metadata } from "next";
import { BoutonsAgenda, BoutonWhatsApp, TitreMerci } from "@/components/Merci";
import { CompteARebours } from "@/components/CompteARebours";
import { VideoPresentation } from "@/components/VideoPresentation";
import { Footer } from "@/components/Footer";
import { publicFileExists } from "@/lib/assets";
import { POSTER_MERCI, VIDEO_MERCI, WHATSAPP_URL } from "@/content/evenement";
import styles from "./merci.module.css";

export const metadata: Metadata = {
  title: "Ta place est réservée · Live boudoir avec Benjamin",
  robots: { index: false, follow: false },
};

// Page merci, volontairement simple : vidéo, groupe WhatsApp (la priorité),
// programme, puis agenda et compte à rebours. Un seul bouton WhatsApp, juste sous la vidéo.

const AVANTAGES_GROUPE = [
  "Tes liens d'accès aux deux soirées",
  "Les rappels juste avant chaque live",
  "Les annonces qui ne passent pas par email",
];

export default function MerciPage() {
  const video = publicFileExists(VIDEO_MERCI) ? VIDEO_MERCI : undefined;
  const poster = publicFileExists(POSTER_MERCI) ? POSTER_MERCI : undefined;

  return (
    <>
      <a href="#whatsapp" className={styles.bandeau}>
        <span className="pulse" aria-hidden="true" />
        <b>Ne ferme pas cette page.</b>
        <span className={styles.bandeauSuite}>1 dernière étape</span>
        <span aria-hidden="true">↓</span>
      </a>

      <main className={styles.page}>
        <header className={`conteneur ${styles.entete}`}>
          <span className="surtitre">Inscription confirmée</span>
          <TitreMerci />
          <div className={styles.video}>
            <VideoPresentation src={video} poster={poster} aFournir="" />
          </div>
          <div id="whatsapp" className={styles.ctaVideo}>
            <span className={`surtitre ${styles.obligatoire}`}>
              <span className="pulse" aria-hidden="true" />
              Obligatoire
            </span>
            <p className={styles.carteWaTitre}>
              Dernière étape : <em>rejoins le groupe privé du live</em>
            </p>
            <BoutonWhatsApp url={WHATSAPP_URL} />
            <ul className={styles.avantages}>
              {AVANTAGES_GROUPE.map((a) => (
                <li key={a}>
                  <span className={styles.coche} aria-hidden="true">✓</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </header>

        <section className={styles.programme}>
          <div className="conteneur">
            <div className="entete-section">
              <span className="surtitre">Ce qui t&apos;attend</span>
              <h2>
                2 soirées, <em>en direct</em>
              </h2>
            </div>
            <div className={styles.soirees}>
              <article className={styles.soiree}>
                <span className={styles.soireeTag}>Soirée 1 · Dim. 18 oct. · 20h</span>
                <h3>Créer l&apos;offre boudoir qui te fait vivre toute l&apos;année</h3>
                <p>Pourquoi le boudoir, comment construire ton offre premium, et à quel prix la vendre.</p>
              </article>
              <article className={styles.soiree}>
                <span className={styles.soireeTag}>Soirée 2 · Lun. 19 oct. · 20h</span>
                <h3>Trouver tes clientes</h3>
                <p>Où les trouver, le message exact à leur envoyer pour qu&apos;elles réservent, et tes actions dès le lendemain.</p>
              </article>
            </div>
            <p className={styles.jusquauBout}>
              Reste jusqu&apos;au bout, les deux soirs : bonus et annonce réservés aux présents.
            </p>
          </div>
        </section>

        <section className={`conteneur ${styles.agendaSection}`}>
          <h2>Bloque les deux soirs dans ton agenda</h2>
          <BoutonsAgenda />
          <div className={styles.reboursCarte}>
            <p className={styles.reboursTitre}>La première soirée commence dans</p>
            <CompteARebours variante="blocs" />
            <p className={styles.reboursDates}>Dimanche 18 & lundi 19 octobre · 20h · en ligne</p>
          </div>
          <p className={styles.signature}>À dimanche, 20h. Benjamin</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
