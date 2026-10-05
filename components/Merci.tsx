"use client";

import { useEffect, useState } from "react";
import { SOIREES, defaultLiveUrl, googleCalendarUrl } from "@/lib/event";
import { trackCompleteRegistration } from "./MetaPixel";
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

const STORAGE_EVENEMENTS = "fa_cr_envoyes";

// Mémorise les inscriptions déjà envoyées au Pixel : un rechargement de /merci ne renvoie rien.
function dejaEnvoye(eventId: string): boolean {
  try {
    return (JSON.parse(localStorage.getItem(STORAGE_EVENEMENTS) || "[]") as string[]).includes(eventId);
  } catch {
    return false;
  }
}

function marquerEnvoye(eventId: string, data: Inscription) {
  try {
    sessionStorage.setItem(STORAGE_INSCRIPTION, JSON.stringify({ ...data, eventId, leadEnvoye: true }));
  } catch {}
  try {
    const liste = JSON.parse(localStorage.getItem(STORAGE_EVENEMENTS) || "[]") as string[];
    localStorage.setItem(STORAGE_EVENEMENTS, JSON.stringify([...liste, eventId].slice(-20)));
  } catch {}
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
    // CompleteRegistration, une seule fois par inscription, avec l'eventID généré à l'envoi du
    // formulaire (le même que celui envoyé par le serveur à l'API Conversions).
    const data = lireInscription();
    const eventId = data.eventId || new URLSearchParams(window.location.search).get("eid") || "";
    if (!/^[A-Za-z0-9-]{8,64}$/.test(eventId) || data.leadEnvoye || dejaEnvoye(eventId)) return;
    marquerEnvoye(eventId, data);
    trackCompleteRegistration(eventId);
  }, []);

  return (
    // 2 lignes pile : la taille s'ajuste à la longueur de la 1re ligne. Prénom très long : retour à la ligne normal.
    <h1
      className={`${styles.titre} ${prenom.length > 14 ? "" : styles.titreDeuxLignes}`}
      style={{ "--n": Math.max(28, 24 + prenom.length) } as React.CSSProperties}
    >
      <span>Ta place est réservée{prenom ? `, ${prenom}` : ""}.</span> <em>Il te reste 1 chose à faire.</em>
    </h1>
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
      <a className={`${styles.agendaBouton} ${styles.agendaIcs}`} href={ics}>
        <b>Apple / Outlook</b>
        <span>les 2 soirées d&apos;un coup</span>
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
  return (
    <a className={styles.whatsapp} href={url || undefined} target="_blank" rel="noopener">
      {contenu}
    </a>
  );
}
