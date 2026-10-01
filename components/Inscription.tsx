"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  COUNTRIES,
  SEGMENTS,
  TRACKING_KEYS,
  validateLead,
  type FieldErrors,
  type Segment,
  type Tracking,
} from "@/lib/lead";
import styles from "./Inscription.module.css";

export const STORAGE_INSCRIPTION = "fa_inscription";
const STORAGE_TRACKING = "fa_tracking";

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

type Ctx = { open: () => void };
const InscriptionContext = createContext<Ctx>({ open: () => {} });

export function InscriptionProvider({ children }: { children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const open = useCallback(() => {
    const d = dialogRef.current;
    if (d && !d.open) d.showModal();
  }, []);
  const close = useCallback(() => dialogRef.current?.close(), []);

  // Clic sur le fond du dialogue = fermeture.
  const onDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) close();
  };

  return (
    <InscriptionContext.Provider value={{ open }}>
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
          <p className={styles.surtitre}>Dim. 18 et lun. 19 octobre · 20h</p>
          <h2 id="titre-inscription" className={styles.titre}>
            Réserve ta place pour les 2 soirées
          </h2>
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
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [pays, setPays] = useState("FR");
  const [telephone, setTelephone] = useState("");
  const [segment, setSegment] = useState<Segment | "">("");
  const [consentement, setConsentement] = useState(false);
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
      segment,
      consentementRappels: consentement,
      tracking: tracking.current,
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
    try {
      const res = await fetch("/api/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        JSON.stringify({ prenom: prenom.trim(), liveUrl: data.liveUrl || "", eventId: data.eventId, leadEnvoye: false }),
      );
      router.push(`/merci?prenom=${encodeURIComponent(prenom.trim())}`);
    } catch {
      setErreurGlobale("La connexion a coupé. Vérifie ton réseau et réessaie.");
      setEnvoi(false);
    }
  }

  return (
    <form className={styles.formulaire} onSubmit={onSubmit} noValidate>
      <div className={styles.champ}>
        <label htmlFor="f-prenom">Ton prénom</label>
        <input
          id="f-prenom"
          name="prenom"
          autoComplete="given-name"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          aria-invalid={Boolean(errors.prenom)}
          aria-describedby={errors.prenom ? "e-prenom" : undefined}
          required
        />
        {errors.prenom && <p id="e-prenom" className={styles.erreur}>{errors.prenom}</p>}
      </div>

      <div className={styles.champ}>
        <label htmlFor="f-email">Ton email</label>
        <input
          id="f-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="off"
          spellCheck={false}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "e-email" : undefined}
          required
        />
        {errors.email && <p id="e-email" className={styles.erreur}>{errors.email}</p>}
      </div>

      <div className={styles.champ}>
        <label htmlFor="f-tel">Ton numéro de mobile</label>
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
            placeholder="06 12 34 56 78"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            aria-invalid={Boolean(errors.telephone)}
            aria-describedby={errors.telephone ? "e-tel" : "a-tel"}
            required
          />
        </div>
        {errors.telephone ? (
          <p id="e-tel" className={styles.erreur}>{errors.telephone}</p>
        ) : (
          <p id="a-tel" className={styles.aide}>Pour te prévenir quand le live commence.</p>
        )}
      </div>

      <fieldset className={styles.segments} aria-describedby={errors.segment ? "e-segment" : undefined}>
        <legend>Aujourd&apos;hui, tu…</legend>
        {(Object.keys(SEGMENTS) as Segment[]).map((key) => (
          <label key={key} className={`${styles.option} ${segment === key ? styles.optionActive : ""}`}>
            <input
              type="radio"
              name="segment"
              value={key}
              checked={segment === key}
              onChange={() => setSegment(key)}
              aria-invalid={Boolean(errors.segment)}
              required
            />
            <span>{SEGMENTS[key]}</span>
          </label>
        ))}
        {errors.segment && <p id="e-segment" className={styles.erreur}>{errors.segment}</p>}
      </fieldset>

      <label className={styles.consentement}>
        <input type="checkbox" checked={consentement} onChange={(e) => setConsentement(e.target.checked)} />
        <span>
          J&apos;accepte de recevoir les rappels du live par SMS et WhatsApp. Tu peux te désinscrire à tout moment
          en répondant STOP.
        </span>
      </label>

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

      <button type="submit" className="bouton bouton--plein" disabled={envoi}>
        {envoi ? "Je réserve ta place…" : "Je réserve ma place gratuite"}
      </button>

      <p className={styles.mentions}>
        Tu recevras par email ton lien d&apos;accès et les informations du live. Tes données restent chez nous,
        voir la <a href="/confidentialite" target="_blank">politique de confidentialité</a>.
      </p>
    </form>
  );
}
