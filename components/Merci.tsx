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

function usePrenom(): string {
  const [prenom, setPrenom] = useState("");
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("prenom") || "";
    setPrenom((lireInscription().prenom || fromUrl).trim().slice(0, 40));
  }, []);
  return prenom;
}

export function TitreMerci() {
  const prenom = usePrenom();

  useEffect(() => {
    // Événement Lead du Pixel, une seule fois par inscription (même event_id que l'API Conversions).
    const data = lireInscription();
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
      Ta place est réservée{prenom ? `, ${prenom}` : ""}. <em>Il te reste 2 choses à faire.</em>
    </h1>
  );
}

export function AuRevoir() {
  const prenom = usePrenom();
  return (
    <h2 className={styles.auRevoir}>
      À très vite{prenom ? <>, <em>{prenom}</em></> : null}.
    </h2>
  );
}

export function BoutonsAgenda() {
  const [liveUrl, setLiveUrl] = useState(defaultLiveUrl());

  useEffect(() => {
    const data = lireInscription();
    if (data.liveUrl) setLiveUrl(data.liveUrl);
  }, []);

  const ics = `/api/agenda?soiree=tout${liveUrl ? `&lien=${encodeURIComponent(liveUrl)}` : ""}`;

  return (
    <div className={styles.agenda}>
      <a className={styles.agendaBouton} href={ics}>
        <b>Apple Calendrier</b>
        <span>les 2 soirées</span>
      </a>
      <a className={styles.agendaBouton} href={ics}>
        <b>Outlook</b>
        <span>les 2 soirées</span>
      </a>
      {SOIREES.map((s) => (
        <a
          key={s.id}
          className={styles.agendaBouton}
          href={googleCalendarUrl(s, liveUrl)}
          target="_blank"
          rel="noopener"
        >
          <b>Google Agenda</b>
          <span>
            {s.label.toLowerCase()} · {s.jourCourt}
          </span>
        </a>
      ))}
    </div>
  );
}

const IconeWhatsApp = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"
    />
  </svg>
);

export function BoutonWhatsApp({ url }: { url: string }) {
  const contenu = (
    <>
      <span className={styles.waIcone}>
        <IconeWhatsApp />
      </span>
      <span className={styles.waTexte}>
        <b>Je rejoins le groupe WhatsApp</b>
        <small>+ recevoir le lien du live</small>
      </span>
      <span className={styles.waFleche} aria-hidden="true">
        →
      </span>
    </>
  );
  if (!url) {
    return (
      <div className={styles.whatsapp} aria-disabled="true">
        {contenu}
        <span className={`a-valider ${styles.waAFournir}`}>[LIEN WHATSAPP À FOURNIR]</span>
      </div>
    );
  }
  return (
    <a className={styles.whatsapp} href={url} target="_blank" rel="noopener">
      {contenu}
    </a>
  );
}

export function BoutonPartage() {
  const [copie, setCopie] = useState(false);

  async function partager() {
    const url = `${window.location.origin}/?utm_source=partage&utm_medium=merci`;
    const texte = "Benjamin fait 2 lives gratuits sur le boudoir, les 18 et 19 octobre à 20h. Je pense que ça va te plaire :";
    if (navigator.share) {
      try {
        await navigator.share({ title: "Live boudoir avec Benjamin", text: texte, url });
        return;
      } catch {
        return; // partage annulé
      }
    }
    try {
      await navigator.clipboard.writeText(`${texte} ${url}`);
      setCopie(true);
      window.setTimeout(() => setCopie(false), 2500);
    } catch {
      window.prompt("Copie ce lien :", url);
    }
  }

  return (
    <button type="button" className={styles.partage} onClick={partager}>
      {copie ? "Lien copié" : "Partager le live"}
    </button>
  );
}
