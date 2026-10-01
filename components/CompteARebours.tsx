"use client";

import { useEffect, useState } from "react";
import { SOIREES } from "@/lib/event";
import styles from "./CompteARebours.module.css";

const DEBUT = Date.parse(SOIREES[0].startUtc);

function reste(now: number) {
  const s = Math.max(0, Math.floor((DEBUT - now) / 1000));
  return { j: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

const pad = (n: number) => String(n).padStart(2, "0");

// Compte à rebours jusqu'au dimanche 18 octobre, 20h (Paris).
// Rendu vide côté serveur pour éviter un décalage d'hydratation.
export function CompteARebours({ variante = "ligne" }: { variante?: "ligne" | "blocs" }) {
  const [t, setT] = useState<ReturnType<typeof reste> | null>(null);

  useEffect(() => {
    setT(reste(Date.now()));
    const id = window.setInterval(() => setT(reste(Date.now())), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (variante === "blocs") {
    const v = t ?? { j: 0, h: 0, m: 0, s: 0 };
    return (
      <div className={styles.blocs} aria-label="Temps restant avant le live">
        {([["j", "jours"], ["h", "heures"], ["m", "min"], ["s", "sec"]] as const).map(([k, l]) => (
          <div key={k}>
            <b suppressHydrationWarning>{t ? pad(v[k]) : "--"}</b>
            <span>{l}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <p className={styles.ligne}>
      Le live commence dans{" "}
      <b suppressHydrationWarning>{t ? `${t.j} j ${pad(t.h)} h ${pad(t.m)} min ${pad(t.s)} s` : "…"}</b>
    </p>
  );
}
