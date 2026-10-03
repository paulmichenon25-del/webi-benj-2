// Données de l'événement : une seule source de vérité pour la landing,
// la page merci, les liens Google Agenda et les fichiers .ics.

export type Soiree = {
  id: "1" | "2";
  label: string; // « Soirée 1 »
  jour: string; // « Dimanche 18 octobre »
  jourCourt: string; // « Dim. 18 oct. »
  // Heures en UTC. Le 18 et le 19 octobre 2026, Paris est en heure d'été (UTC+2) :
  // 20h à Paris = 18h UTC. (Passage à l'heure d'hiver le 25 octobre 2026.)
  startUtc: string;
  endUtc: string;
  titreAgenda: string;
};

// Durée supposée : 2h (20h-22h). [À CONFIRMER : durée réelle de chaque soirée]
export const SOIREES: Soiree[] = [
  {
    id: "1",
    label: "Soirée 1",
    jour: "Dimanche 18 octobre",
    jourCourt: "Dim. 18 oct.",
    startUtc: "2026-10-18T18:00:00Z",
    endUtc: "2026-10-18T20:00:00Z",
    titreAgenda: "Live boudoir avec Benjamin (soirée 1/2)",
  },
  {
    id: "2",
    label: "Soirée 2",
    jour: "Lundi 19 octobre",
    jourCourt: "Lun. 19 oct.",
    startUtc: "2026-10-19T18:00:00Z",
    endUtc: "2026-10-19T20:00:00Z",
    titreAgenda: "Live boudoir avec Benjamin (soirée 2/2)",
  },
];

export const HEURE = "20h";
export const FUSEAU = "heure de Paris";

export function getSoiree(id: string): Soiree | undefined {
  return SOIREES.find((s) => s.id === id);
}

// Lien du live par défaut, utilisé si WebinarJam ne renvoie pas de lien personnel.
// [À CONFIRMER : lien WebinarJam]
export function defaultLiveUrl(): string {
  return process.env.NEXT_PUBLIC_WEBINAR_LIVE_URL || "";
}

export function agendaDescription(liveUrl: string, soiree: Soiree): string {
  const lien = liveUrl
    ? `Ton lien pour rejoindre le live : ${liveUrl}`
    : "Ton lien pour rejoindre le live t'arrive par email.";
  const suite =
    soiree.id === "1" ? " On se retrouve aussi demain, lundi 19 octobre à 20h, pour la soirée 2." : "";
  const fin = `Reste jusqu'au bout : bonus et annonces réservés aux personnes présentes en direct, non retransmis.${suite}`;
  return [
    `${soiree.label} du live gratuit de Benjamin Hanachowicz (FineArt Académie).`,
    "",
    lien,
    "",
    fin,
  ].join("\n");
}

const toCompactUtc = (iso: string) => iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function googleCalendarUrl(soiree: Soiree, liveUrl: string): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: soiree.titreAgenda,
    dates: `${toCompactUtc(soiree.startUtc)}/${toCompactUtc(soiree.endUtc)}`,
    details: agendaDescription(liveUrl, soiree),
    location: liveUrl || "En ligne",
    ctz: "Europe/Paris",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function icsEscape(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

// Plie les lignes à 75 octets (RFC 5545) pour Outlook.
function fold(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const out: string[] = [];
  let current = "";
  let currentLen = 0;
  for (const char of line) {
    const len = new TextEncoder().encode(char).length;
    const limit = out.length === 0 ? 75 : 74;
    if (currentLen + len > limit) {
      out.push(current);
      current = "";
      currentLen = 0;
    }
    current += char;
    currentLen += len;
  }
  out.push(current);
  return out.join("\r\n ");
}

function vevent(soiree: Soiree, liveUrl: string, stamp: string): string[] {
  return [
    "BEGIN:VEVENT",
    `UID:live-boudoir-2026-10-soiree-${soiree.id}@fineart-academie.com`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toCompactUtc(soiree.startUtc)}`,
    `DTEND:${toCompactUtc(soiree.endUtc)}`,
    `SUMMARY:${icsEscape(soiree.titreAgenda)}`,
    `DESCRIPTION:${icsEscape(agendaDescription(liveUrl, soiree))}`,
    `LOCATION:${icsEscape(liveUrl || "En ligne")}`,
    ...(liveUrl ? [`URL:${liveUrl}`] : []),
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Le live commence dans 1 heure",
    "TRIGGER:-PT1H",
    "END:VALARM",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Le live commence dans 10 minutes",
    "TRIGGER:-PT10M",
    "END:VALARM",
    "END:VEVENT",
  ];
}

// Une soirée, ou les deux d'un coup (un seul fichier = un seul clic sur iPhone).
export function buildIcs(soirees: Soiree | Soiree[], liveUrl: string, now = new Date()): string {
  const stamp = toCompactUtc(now.toISOString());
  const liste = Array.isArray(soirees) ? soirees : [soirees];
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//FineArt Academie//Live boudoir octobre 2026//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...liste.flatMap((s) => vevent(s, liveUrl, stamp)),
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

// N'accepte que des liens https vers WebinarJam (ou le lien par défaut configuré),
// pour qu'on ne puisse pas fabriquer un .ics avec un lien arbitraire.
export function isAllowedLiveUrl(url: string): boolean {
  if (!url) return false;
  if (url === defaultLiveUrl()) return true;
  try {
    const u = new URL(url);
    return (
      u.protocol === "https:" &&
      (u.hostname === "webinarjam.com" ||
        u.hostname.endsWith(".webinarjam.com") ||
        u.hostname.endsWith(".webinarjam.net"))
    );
  } catch {
    return false;
  }
}
