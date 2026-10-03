"use client";

import { useRef, useState } from "react";
import styles from "./VideoPresentation.module.css";

// Vidéo de Benjamin en tête de page : rien n'est chargé avant le clic.
export function VideoPresentation({
  src,
  poster,
  duree,
  aFournir = "/benjamin-presentation.mp4",
}: {
  src?: string;
  poster?: string;
  duree?: string;
  aFournir?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [lancee, setLancee] = useState(false);

  if (!src) {
    return (
      <div className={styles.cadre}>
        <div className={styles.vide}>
          <span className={styles.lecture} aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>
          </span>
          {aFournir && <span className="a-valider">[VIDÉO À FOURNIR : {aFournir}]</span>}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cadre}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        preload="none"
        playsInline
        controls={lancee}
        onPlay={() => setLancee(true)}
      />
      {!lancee && (
        <button
          type="button"
          className={styles.bouton}
          onClick={() => {
            setLancee(true);
            ref.current?.play().catch(() => {});
          }}
          aria-label="Lire la vidéo de Benjamin"
        >
          <span className={styles.lecture} aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>
          </span>
          {duree && <span className={styles.duree}>Le mot de Benjamin · {duree}</span>}
        </button>
      )}
    </div>
  );
}
