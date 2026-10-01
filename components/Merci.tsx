"use client";

import { useEffect, useState } from "react";
import { SOIREES, defaultLiveUrl, googleCalendarUrl } from "@/lib/event";
import { trackLead } from "./MetaPixel";
import { STORAGE_INSCRIPTION } from "./Inscription";
import styles from "@/app/merci/merci.module.css";

type Inscription = { prenom?: string; liveUrl?: string; eventId?: string; leadEnvoye?: boolean };

function lireInscription(): Inscription {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_INSCRIPTION) || "{}");
  } catch {
    return {};
  }
}

export function TitreMerci() {
  const [prenom, setPrenom] = useState("");

  useEffect(() => {
    const data = lireInscription();
    const fromUrl = new URLSearchParams(window.location.search).get("prenom") || "";
    setPrenom((data.prenom || fromUrl).trim().slice(0, 40));

    // Événement Lead du Pixel, une seule fois par inscription (même event_id que l'API Conversions).
    if (data.eventId && !data.leadEnvoye) {
      const envoyer = () => {
        trackLead(data.eventId!);
        try {
          sessionStorage.setItem(STORAGE_INSCRIPTION, JSON.stringify({ ...data, leadEnvoye: true }));
        } catch {}
      };
      // Le script du Pixel peut finir de charger après ce composant.
      if (window.fbq) envoyer();
      else {
        let essais = 0;
        const t = window.setInterval(() => {
          if (window.fbq || ++essais > 20) {
            window.clearInterval(t);
            if (window.fbq) envoyer();
          }
        }, 250);
      }
    }
  }, []);

  return (
    <h1 className={styles.titre}>
      C&apos;est bon{prenom ? `, ${prenom}` : ""}, ta place est réservée
    </h1>
  );
}

export function BoutonsAgenda() {
  const [liveUrl, setLiveUrl] = useState(defaultLiveUrl());

  useEffect(() => {
    const data = lireInscription();
    if (data.liveUrl) setLiveUrl(data.liveUrl);
  }, []);

  return (
    <div className={styles.agenda}>
      {SOIREES.map((s) => {
        const ics = `/api/agenda?soiree=${s.id}${liveUrl ? `&lien=${encodeURIComponent(liveUrl)}` : ""}`;
        return (
          <div key={s.id} className={styles.agendaSoiree}>
            <p className={styles.agendaLabel}>
              {s.label} · {s.jour} · 20h
            </p>
            <div className={styles.agendaBoutons}>
              <a className="bouton bouton--secondaire" href={googleCalendarUrl(s, liveUrl)} target="_blank" rel="noopener">
                Google Agenda
              </a>
              <a className="bouton bouton--secondaire" href={ics}>
                Apple / Outlook
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
