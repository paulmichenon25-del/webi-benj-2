"use client";

import { useEffect, useState } from "react";
import { BoutonInscription } from "./Inscription";
import styles from "./CtaMobile.module.css";

// Bouton fixé en bas d'écran sur mobile, visible une fois le hero dépassé
// et masqué quand le CTA final est à l'écran.
export function CtaMobile() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const fin = document.getElementById("cta-final");
    if (!hero || !fin || !("IntersectionObserver" in window)) return;
    let heroVisible = true;
    let finVisible = false;
    const update = () => setVisible(!heroVisible && !finVisible);
    const obs = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) heroVisible = e.isIntersecting;
        if (e.target === fin) finVisible = e.isIntersecting;
      }
      update();
    });
    obs.observe(hero);
    obs.observe(fin);
    return () => obs.disconnect();
  }, []);

  return (
    <div className={`${styles.barre} ${visible ? styles.visible : ""}`} aria-hidden={!visible}>
      <div className={styles.infos}>
        <strong>Live gratuit</strong>
        <span>18 et 19 oct. · 20h</span>
      </div>
      <BoutonInscription className={styles.bouton}>Je réserve ma place</BoutonInscription>
    </div>
  );
}
