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
// programme, puis compte à rebours et agenda. Un seul bouton WhatsApp sur la page.

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
        </header>

        <section id="whatsapp" className={`conteneur ${styles.etapes}`}>
          <article className={`${styles.etape} ${styles.etapeForte}`}>
            <span className={`${styles.etiquette} ${styles.etiquetteVerte}`}>Obligatoire</span>
            <h2>Rejoins le groupe WhatsApp privé</h2>
            <p>C&apos;est là que tout se passe :</p>
            <ul className={styles.avantages}>
              {AVANTAGES_GROUPE.map((a) => (
                <li key={a}>
                  <span className={styles.coche} aria-hidden="true">✓</span>
                  {a}
                </li>
              ))}
            </ul>
            <BoutonWhatsApp url={WHATSAPP_URL} />
            <p className={styles.petit}>Groupe privé réservé aux inscrits.</p>
          </article>
        </section>

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
                <span className={styles.etiquette}>Dim. 18 oct. · 20h</span>
                <h3>L&apos;opportunité boudoir et ta structure</h3>
                <p>Pourquoi le boudoir, ton offre premium, et le prix pour en vivre toute l&apos;année.</p>
              </article>
              <article className={styles.soiree}>
                <span className={styles.etiquette}>Lun. 19 oct. · 20h</span>
                <h3>Trouver tes clientes</h3>
                <p>Où les trouver, le message à envoyer à tes anciennes clientes, et tes premières actions.</p>
              </article>
            </div>
            <p className={styles.jusquauBout}>
              Reste jusqu&apos;au bout, les deux soirs : bonus et annonce réservés aux présents.
            </p>
          </div>
        </section>

        <section className={`conteneur ${styles.agendaSection}`}>
          <div className={styles.reboursCarte}>
            <p className={styles.reboursTitre}>La première soirée commence dans</p>
            <CompteARebours variante="blocs" />
            <p className={styles.reboursDates}>Dimanche 18 & lundi 19 octobre · 20h · en ligne</p>
          </div>
          <h2>Bloque les deux soirs dans ton agenda</h2>
          <BoutonsAgenda />
          <p className={styles.signature}>À dimanche, 20h. Benjamin</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
