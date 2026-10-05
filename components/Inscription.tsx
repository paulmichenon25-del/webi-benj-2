"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { trackOuvertureFormulaire } from "./MetaPixel";
import {
  COUNTRIES,
  TRACKING_KEYS,
  validateLead,
  type FieldErrors,
  type Tracking,
} from "@/lib/lead";
import styles from "./Inscription.module.css";

export const STORAGE_INSCRIPTION = "fa_inscription";


const STORAGE_TRACKING = "fa_tracking";

function nouvelEventId(): string {
  try {
    if (crypto.randomUUID) return crypto.randomUUID();
  } catch {}
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function safeGet(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* navigation privée : on fait sans */
  }
}

// Récupère les UTM / fbclid de l'URL d'arrivée. On garde ceux de la première
// arrivée dans la session si l'URL actuelle n'en contient pas (rechargement, ancre…).
function readTracking(): Tracking {
  const params = new URLSearchParams(window.location.search);
  const fromUrl: Tracking = {};
  for (const key of TRACKING_KEYS) {
    const v = params.get(key);
    if (v) fromUrl[key] = v;
  }
  let stored: Tracking = {};
  try {
    stored = JSON.parse(safeGet(STORAGE_TRACKING) || "{}");
  } catch {
    stored = {};
  }
  const hasUrlTracking = Object.keys(fromUrl).length > 0;
  const tracking: Tracking = hasUrlTracking
    ? { ...fromUrl, page_url: window.location.href, referrer: document.referrer }
    : {
        ...stored,
        page_url: stored.page_url || window.location.href,
        referrer: stored.referrer ?? document.referrer,
      };
  safeSet(STORAGE_TRACKING, JSON.stringify(tracking));
  return tracking;
}

type Ctx = { open: () => void; variante: string };
const InscriptionContext = createContext<Ctx>({ open: () => {}, variante: "" });

export function InscriptionProvider({ children, variante = "" }: { children: React.ReactNode; variante?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const open = useCallback(() => {
    const d = dialogRef.current;
    if (d && !d.open) {
      d.showModal();
      trackOuvertureFormulaire();
    }
  }, []);
  const close = useCallback(() => dialogRef.current?.close(), []);

  // Clic sur le fond du dialogue = fermeture.
  const onDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) close();
  };

  return (
    <InscriptionContext.Provider value={{ open, variante }}>
      {children}
      <dialog
        ref={dialogRef}
        className={styles.dialogue}
        aria-labelledby="titre-inscription"
        onClick={onDialogClick}
      >
        <div className={styles.panneau}>
          <button type="button" className={styles.fermer} onClick={close} aria-label="Fermer">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <h2 id="titre-inscription" className={styles.titre}>
            Réserve ta place
          </h2>
          <p className={styles.sousTitre}>Les 18 et 19 octobre à 20h, en direct.</p>
          <FormulaireInscription />
        </div>
      </dialog>
    </InscriptionContext.Provider>
  );
}

export function BoutonInscription({
  children = "Je réserve ma place gratuite",
  plein = false,
  className = "",
}: {
  children?: React.ReactNode;
  plein?: boolean;
  className?: string;
}) {
  const { open } = useContext(InscriptionContext);
  return (
    <button
      type="button"
      className={`bouton ${plein ? "bouton--plein" : ""} ${className}`}
      onClick={open}
      aria-haspopup="dialog"
    >
      {children}
    </button>
  );
}

function FormulaireInscription() {
  const router = useRouter();
  const { variante } = useContext(InscriptionContext);
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [pays, setPays] = useState("FR");
  const [telephone, setTelephone] = useState("");
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [erreurGlobale, setErreurGlobale] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const tracking = useRef<Tracking>({});

  useEffect(() => {
    tracking.current = readTracking();
  }, []);

  const indicatif = COUNTRIES.find((c) => c.code === pays)?.dial ?? "+33";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreurGlobale("");
    const payload = {
      prenom,
      email,
      telephone,
      pays,
      segment: "",
      consentementRappels: false,
      tracking: { ...tracking.current, variante },
      website,
    };
    const found = validateLead(payload);
    setErrors(found);
    if (Object.keys(found).length) {
      const premier = e.currentTarget.querySelector<HTMLElement>("[aria-invalid='true']");
      premier?.focus();
      return;
    }
    setEnvoi(true);
    // ID unique de l'inscription, partagé par le Pixel (sur /merci) et l'API Conversions (serveur)
    // pour que Meta ne compte qu'une seule fois l'événement CompleteRegistration.
    const eventId = nouvelEventId();
    try {
      const res = await fetch("/api/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, eventId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        if (data.errors) setErrors(data.errors);
        setErreurGlobale(data.error || "Ton inscription n'est pas passée. Réessaie dans un instant.");
        setEnvoi(false);
        return;
      }
      safeSet(
        STORAGE_INSCRIPTION,
        JSON.stringify({ prenom: prenom.trim(), liveUrl: data.liveUrl || "", eventId: data.eventId || eventId, leadEnvoye: false }),
      );
      router.push(`/merci?eid=${encodeURIComponent(data.eventId || eventId)}`);
    } catch {
      setErreurGlobale("La connexion a coupé. Vérifie ton réseau et réessaie.");
      setEnvoi(false);
    }
  }

  return (
    <form className={styles.formulaire} onSubmit={onSubmit} noValidate>
      <div className={styles.champ}>
        <label htmlFor="f-prenom" className="visuellement-cache">Ton prénom</label>
        <input
          id="f-prenom"
          name="prenom"
          autoComplete="given-name"
          placeholder="Ton prénom"
          value={prenom}
          onChange={(e) => { setPrenom(e.target.value); setErrors((x) => ({ ...x, prenom: undefined })); }}
          aria-invalid={Boolean(errors.prenom)}
          aria-describedby={errors.prenom ? "e-prenom" : undefined}
          required
        />
        {errors.prenom && <p id="e-prenom" className={styles.erreur}>{errors.prenom}</p>}
      </div>

      <div className={styles.champ}>
        <label htmlFor="f-email" className="visuellement-cache">Ton email</label>
        <input
          id="f-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="Ton meilleur email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors((x) => ({ ...x, email: undefined })); }}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "e-email" : undefined}
          required
        />
        {errors.email && <p id="e-email" className={styles.erreur}>{errors.email}</p>}
      </div>

      <div className={styles.champ}>
        <label htmlFor="f-tel" className="visuellement-cache">Ton numéro de mobile</label>
        <div className={styles.telephone}>
          <div className={styles.indicatif}>
            <span aria-hidden="true">{indicatif}</span>
            <select
              aria-label="Indicatif du pays"
              value={pays}
              onChange={(e) => setPays(e.target.value)}
              autoComplete="tel-country-code"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label} ({c.dial})
                </option>
              ))}
            </select>
          </div>
          <input
            id="f-tel"
            name="telephone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="Ton numéro de mobile"
            value={telephone}
            onChange={(e) => { setTelephone(e.target.value); setErrors((x) => ({ ...x, telephone: undefined })); }}
            aria-invalid={Boolean(errors.telephone)}
            aria-describedby={errors.telephone ? "e-tel" : undefined}
            required
          />
        </div>
        {errors.telephone && <p id="e-tel" className={styles.erreur}>{errors.telephone}</p>}
      </div>

      {/* Pot de miel : invisible pour les humains */}
      <div className="visuellement-cache" aria-hidden="true">
        <label>
          Site web
          <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>

      {erreurGlobale && (
        <p className={styles.erreurGlobale} role="alert">
          {erreurGlobale}
        </p>
      )}

      <button type="submit" className={`bouton bouton--plein ${styles.envoyer}`} disabled={envoi}>
        <span>{envoi ? "Je réserve ta place…" : "Je réserve ma place"}</span>
        {!envoi && <small>Oui, je participe</small>}
      </button>

      <p className={styles.cadeau}>Un cadeau t&apos;attend dans ta boîte mail juste après ton inscription.</p>

      <p className={styles.mentions}>
        Tes infos servent uniquement à t&apos;envoyer les accès au live.
      </p>
    </form>
  );
}
