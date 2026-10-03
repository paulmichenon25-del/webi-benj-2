import type { Metadata } from "next";
import { AuRevoir, BoutonPartage, BoutonsAgenda, BoutonWhatsApp, TitreMerci } from "@/components/Merci";
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

// Page merci : le modèle de la page de validation du live de juillet (bandeau
// « Ne ferme pas cette page », groupe WhatsApp, compte à rebours) et celui de
// Déclic (2 étapes numérotées, rappel du programme, partage).

const AVANTAGES_GROUPE = [
  "Tes liens d'accès aux deux soirées",
  "Les rappels juste avant chaque live",
  "Tes questions, avant, pendant et après les lives",
  "Les annonces qui ne passent pas par email",
  "Des échanges directs avec moi",
];

export default function MerciPage() {
  const video = publicFileExists(VIDEO_MERCI) ? VIDEO_MERCI : undefined;
  const poster = publicFileExists(POSTER_MERCI) ? POSTER_MERCI : undefined;

  return (
    <>
      <a href="#etapes" className={styles.bandeau}>
        <span className="pulse" aria-hidden="true" />
        <b>Ne ferme pas cette page.</b>
        <span className={styles.bandeauSuite}>Encore 2 étapes</span>
        <span aria-hidden="true">↓</span>
      </a>

      <main className={styles.page}>
        {/* ============ EN-TÊTE ============ */}
        <header className={`conteneur ${styles.entete}`}>
          <span className={styles.valide} aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="surtitre">Inscription confirmée</span>
          <TitreMerci />
          <p className={styles.chapo}>
            Deux minutes, maintenant. C&apos;est ce qui fait que tu seras vraiment là dimanche soir, au lieu
            d&apos;y repenser lundi matin.
          </p>

          <div className={styles.video}>
            <VideoPresentation src={video} poster={poster} duree="1 min" aFournir={VIDEO_MERCI} />
            <p className={styles.note}>À regarder en premier · un petit mot de ma part</p>
          </div>

          <div className={styles.ctaHaut}>
            <BoutonWhatsApp url={WHATSAPP_URL} />
            <p className={styles.note}>Étape la plus importante. Tout passe par là.</p>
          </div>
        </header>

        {/* ============ LES 2 ÉTAPES ============ */}
        <section id="etapes" className={`conteneur ${styles.etapes}`}>
          <article className={styles.etape}>
            <span className={styles.etiquette}>Étape 1</span>
            <h2>Bloque les deux soirs dans ton agenda</h2>
            <p>
              <b>Dimanche 18 et lundi 19 octobre, à 20h</b> (heure de Paris). Ajoute-les maintenant : dans deux
              semaines, tu n&apos;y penseras plus.
            </p>
            <BoutonsAgenda />
            <p className={styles.petit}>Je t&apos;envoie aussi le lien par email avant chaque soirée.</p>
          </article>

          <article className={`${styles.etape} ${styles.etapeForte}`}>
            <span className={`${styles.etiquette} ${styles.etiquetteVerte}`}>Étape 2 · La plus importante</span>
            <h2>Rejoins le groupe WhatsApp privé</h2>
            <p>C&apos;est là que tout se passe vraiment.</p>
            <ul className={styles.avantages}>
              {AVANTAGES_GROUPE.map((a) => (
                <li key={a}>
                  <span className={styles.coche} aria-hidden="true">✓</span>
                  {a}
                </li>
              ))}
            </ul>
            <BoutonWhatsApp url={WHATSAPP_URL} />
            <p className={styles.petit}>Groupe privé réservé aux inscrits. Tu peux le quitter quand tu veux.</p>
          </article>
        </section>

        {/* ============ PENDANT CE TEMPS ============ */}
        <section className={`conteneur ${styles.mail}`}>
          <span className="surtitre">Pendant ce temps</span>
          <h2>
            Ton cadeau mystère <em>t&apos;attend par email</em>
          </h2>
          <p>
            Il vient de partir, avec ta confirmation : « C&apos;est bon, ta place est réservée ». Tu ne le vois
            pas ? Regarde dans tes spams ou l&apos;onglet Promotions, et déplace-le dans ta boîte principale.
            C&apos;est là que t&apos;arriveront tes liens.
          </p>
        </section>

        {/* ============ COMPTE À REBOURS ============ */}
        <section className={`conteneur ${styles.rebours}`}>
          <div className={styles.reboursCarte}>
            <p className={styles.reboursTitre}>La première soirée commence dans</p>
            <CompteARebours variante="blocs" />
            <p className={styles.reboursDates}>Dimanche 18 & lundi 19 octobre · 20h · en ligne</p>
          </div>
        </section>

        {/* ============ CE QUI T'ATTEND ============ */}
        <section className={`conteneur ${styles.programme}`}>
          <div className="entete-section">
            <span className="surtitre">Pour mémoire</span>
            <h2>
              Ce qui <em>t&apos;attend</em>
            </h2>
          </div>
          <div className={styles.soirees}>
            <article className={styles.soiree}>
              <span className={styles.etiquette}>Soirée 1 · Dim. 18 oct. · 20h</span>
              <h3>L&apos;opportunité boudoir et ta structure</h3>
              <p>Pourquoi le boudoir, ton offre premium, et le prix pour en vivre toute l&apos;année.</p>
            </article>
            <article className={styles.soiree}>
              <span className={styles.etiquette}>Soirée 2 · Lun. 19 oct. · 20h</span>
              <h3>Trouver tes clientes</h3>
              <p>Où les trouver, le message à envoyer à tes anciennes clientes, et tes premières actions.</p>
            </article>
          </div>
          <p className={styles.jusquauBout}>
            Reste jusqu&apos;au bout, les deux soirs : bonus et annonce réservés aux présents. Rien n&apos;est
            retransmis.
          </p>
        </section>

        {/* ============ À TRÈS VITE ============ */}
        <section className={styles.fin}>
          <div className={`conteneur ${styles.finCarte}`}>
            <AuRevoir />
            <p>
              Tu connais une photographe ou un photographe qui aimerait vivre de sa passion ? Envoie-lui le lien.
              On est mieux à plusieurs.
            </p>
            <BoutonPartage />
            <p className={styles.signature}>Benjamin</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
