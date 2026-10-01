import type { Metadata } from "next";
import { BoutonsAgenda, TitreMerci } from "@/components/Merci";
import { Footer } from "@/components/Footer";
import { publicFileExists } from "@/lib/assets";
import { SOIREES } from "@/lib/event";
import styles from "./merci.module.css";

export const metadata: Metadata = {
  title: "Ta place est réservée · Live boudoir avec Benjamin",
  robots: { index: false, follow: false },
};

const VIDEO_MERCI = "/benjamin-merci.mp4"; // [VIDÉO À FOURNIR : /public/benjamin-merci.mp4]
const POSTER_MERCI = "/benjamin-merci.jpg"; // image d'aperçu facultative

// Lien du groupe / de la chaîne WhatsApp de rappel. Bloc masqué si vide.
// [À CONFIRMER : lien WhatsApp, ou retirer ce bloc]
const WHATSAPP_URL = process.env.NEXT_PUBLIC_WHATSAPP_URL || "";

export default function MerciPage() {
  const video = publicFileExists(VIDEO_MERCI);
  const poster = publicFileExists(POSTER_MERCI) ? POSTER_MERCI : undefined;
  let etape = 0;

  return (
    <>
      <main className={styles.page}>
        <div className="conteneur etroit">
          <header className={styles.entete}>
            <TitreMerci />
            <div className={styles.dates}>
              {SOIREES.map((s) => (
                <div key={s.id} className={styles.date}>
                  <span className={styles.dateLabel}>{s.label}</span>
                  <span className={styles.dateJour}>{s.jour}</span>
                  <span className={styles.dateHeure}>20h</span>
                </div>
              ))}
            </div>
            <p className={styles.fuseau}>Heure de Paris · ton lien d&apos;accès arrive par email</p>
          </header>

          <section className={styles.bloc}>
            <p className={styles.etape}>Étape {++etape}</p>
            <h2>Bloque tes deux soirées dans ton agenda</h2>
            <p>Ça prend dix secondes, et c&apos;est ce qui fait que tu seras vraiment là.</p>
            <BoutonsAgenda />
          </section>

          <section className={styles.bloc}>
            <p className={styles.etape}>Étape {++etape}</p>
            <h2>Un petit mot de ma part</h2>
            <div className={styles.video}>
              {video ? (
                <video src={VIDEO_MERCI} poster={poster} controls playsInline preload="metadata" />
              ) : (
                <div className={styles.videoVide}>
                  <span className="a-valider">[VIDÉO À FOURNIR : {VIDEO_MERCI}]</span>
                </div>
              )}
            </div>
          </section>

          {WHATSAPP_URL && (
            <section className={styles.bloc}>
              <p className={styles.etape}>Étape {++etape}</p>
              <h2>Reçois le rappel sur WhatsApp</h2>
              <p>Je t&apos;envoie le lien du live juste avant qu&apos;on commence.</p>
              <a className="bouton bouton--plein" href={WHATSAPP_URL} target="_blank" rel="noopener">
                Je rejoins la chaîne WhatsApp
              </a>
            </section>
          )}

          <section className={`${styles.bloc} ${styles.rappel}`}>
            <h2>Sois là en direct, les deux soirs</h2>
            <p>
              Chaque soir, je fais des annonces et je donne des bonus réservés aux personnes présentes en direct.
              Ils ne sont pas retransmis. Garde tes deux soirées.
            </p>
            <p className={styles.signature}>À dimanche. Benjamin</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
