"use client";

import { useRef, useState } from "react";
import styles from "./Temoignages.module.css";

export type TemoignageMedia = {
  slug: string;
  nom: string;
  legende: string;
  video?: string;
  image?: string;
};

// Vidéos en lecture au clic, une seule à la fois. Rien n'est téléchargé avant
// le clic (preload="none") pour ne pas alourdir la page sur mobile.
export function Temoignages({ items }: { items: TemoignageMedia[] }) {
  const [enLecture, setEnLecture] = useState<string | null>(null);
  const videos = useRef(new Map<string, HTMLVideoElement>());

  function lire(slug: string) {
    videos.current.forEach((v, key) => {
      if (key !== slug) v.pause();
    });
    setEnLecture(slug);
    const v = videos.current.get(slug);
    v?.play().catch(() => {});
  }

  return (
    <ul className={styles.liste}>
      {items.map((t) => (
        <li key={t.slug} className={styles.carte}>
          <div className={styles.media}>
            {t.video ? (
              <>
                <video
                  ref={(el) => {
                    if (el) videos.current.set(t.slug, el);
                    else videos.current.delete(t.slug);
                  }}
                  src={t.video}
                  poster={t.image}
                  preload="none"
                  playsInline
                  controls={enLecture === t.slug}
                  onPlay={() => {
                    if (enLecture !== t.slug) lire(t.slug);
                  }}
                  onEnded={() => setEnLecture(null)}
                />
                {enLecture !== t.slug && (
                  <button
                    type="button"
                    className={styles.lecture}
                    onClick={() => lire(t.slug)}
                    aria-label={`Lire le témoignage de ${t.nom}`}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
                    </svg>
                  </button>
                )}
              </>
            ) : t.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={t.image} alt={`Témoignage de ${t.nom}`} loading="lazy" />
            ) : (
              <div className={styles.vide}>
                <span className="a-valider">[CONTENU À FOURNIR : vidéo ou capture]</span>
              </div>
            )}
          </div>
          <p className={styles.nom}>{t.nom}</p>
          <p className={styles.legende}>
            {t.legende.startsWith("[") ? <span className="a-valider">{t.legende}</span> : t.legende}
          </p>
        </li>
      ))}
    </ul>
  );
}
