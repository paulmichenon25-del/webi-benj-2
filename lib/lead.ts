import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js/mobile";

// Validation partagée entre le formulaire (navigateur) et l'API (serveur).

export const SEGMENTS = {
  boudoir: "fais déjà du boudoir",
  autre_specialite: "fais du mariage, portrait ou grossesse, pas encore de boudoir",
  debutant: "débutes en photo",
} as const;

export type Segment = keyof typeof SEGMENTS;

export const TRACKING_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
] as const;

export type TrackingKey = (typeof TRACKING_KEYS)[number];

export type Tracking = Partial<Record<TrackingKey, string>> & {
  page_url?: string; // URL complète de la landing au moment de l'inscription
  referrer?: string; // URL de provenance (document.referrer)
  variante?: string; // variante de landing vue (A/B test)
};

// Indicatifs proposés dans le formulaire (+33 par défaut).
export const COUNTRIES: { code: CountryCode; label: string; dial: string }[] = [
  { code: "FR", label: "France", dial: "+33" },
  { code: "BE", label: "Belgique", dial: "+32" },
  { code: "CH", label: "Suisse", dial: "+41" },
  { code: "LU", label: "Luxembourg", dial: "+352" },
  { code: "MC", label: "Monaco", dial: "+377" },
  { code: "CA", label: "Canada", dial: "+1" },
  { code: "RE", label: "La Réunion", dial: "+262" },
  { code: "GP", label: "Guadeloupe", dial: "+590" },
  { code: "MQ", label: "Martinique", dial: "+596" },
  { code: "GF", label: "Guyane", dial: "+594" },
  { code: "PF", label: "Polynésie fr.", dial: "+689" },
  { code: "NC", label: "Nouvelle-Calédonie", dial: "+687" },
  { code: "MA", label: "Maroc", dial: "+212" },
  { code: "TN", label: "Tunisie", dial: "+216" },
  { code: "ES", label: "Espagne", dial: "+34" },
  { code: "PT", label: "Portugal", dial: "+351" },
  { code: "IT", label: "Italie", dial: "+39" },
  { code: "DE", label: "Allemagne", dial: "+49" },
  { code: "GB", label: "Royaume-Uni", dial: "+44" },
];

export type NormalizedPhone = {
  e164: string; // +33612345678
  countryCallingCode: string; // 33
  nationalNumber: string; // 612345678
};

// Normalise un numéro de mobile en E.164. Accepte « 06 12 34 56 78 »,
// « 6.12.34.56.78 », « +33 6 12 34 56 78 », « 0033612345678 »…
export function normalizeMobile(raw: string, country: string): NormalizedPhone | null {
  const cleaned = (raw || "").trim().replace(/^00/, "+");
  if (!cleaned) return null;
  const iso = (COUNTRIES.find((c) => c.code === country)?.code ?? "FR") as CountryCode;
  const parsed = parsePhoneNumberFromString(cleaned, iso);
  if (!parsed || !parsed.isValid()) return null;
  const type = parsed.getType();
  // Avec les métadonnées « mobile », getType() vaut MOBILE ou FIXED_LINE_OR_MOBILE
  // pour un numéro de mobile. On refuse les fixes : ils ne reçoivent ni SMS ni WhatsApp.
  if (type && type !== "MOBILE" && type !== "FIXED_LINE_OR_MOBILE") return null;
  return {
    e164: parsed.number,
    countryCallingCode: parsed.countryCallingCode,
    nationalNumber: parsed.nationalNumber,
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test((email || "").trim()) && email.length <= 254;
}

export type LeadInput = {
  prenom: string;
  email: string;
  telephone: string;
  pays: string;
  segment: string;
  consentementRappels: boolean;
  tracking: Tracking;
  website?: string; // pot de miel anti-robots, doit rester vide
};

export type FieldErrors = Partial<Record<"prenom" | "email" | "telephone" | "segment", string>>;

export function validateLead(input: LeadInput): FieldErrors {
  const errors: FieldErrors = {};
  const prenom = (input.prenom || "").trim();
  if (!prenom) errors.prenom = "Dis-moi ton prénom.";
  else if (prenom.length > 60) errors.prenom = "Ton prénom semble un peu long.";
  if (!isValidEmail(input.email)) errors.email = "Vérifie ton adresse email.";
  if (!normalizeMobile(input.telephone, input.pays))
    errors.telephone = "Vérifie ton numéro de mobile.";
  if (!(input.segment in SEGMENTS)) errors.segment = "Choisis la réponse qui te correspond.";
  return errors;
}

export function sanitizeTracking(raw: unknown): Tracking {
  const out: Tracking = {};
  if (!raw || typeof raw !== "object") return out;
  const src = raw as Record<string, unknown>;
  for (const key of [...TRACKING_KEYS, "page_url", "referrer", "variante"] as const) {
    const value = src[key];
    if (typeof value === "string" && value.trim()) out[key] = value.trim().slice(0, 1000);
  }
  return out;
}
