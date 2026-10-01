// Stockage de chaque inscrit avec ses paramètres de tracking (UTM, fbclid,
// provenance), pour calculer le coût par inscrit par pub.
// Envoi en JSON vers un webhook (Make, Zapier, Google Apps Script, n8n, CRM…).
// [À CONFIRMER : outil de stockage des inscrits]

export type StoredLead = {
  inscrit_le: string; // ISO 8601
  prenom: string;
  email: string;
  telephone_e164: string;
  segment: string;
  segment_libelle: string;
  consentement_rappels_sms_whatsapp: boolean;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  fbclid: string;
  page_url: string;
  referrer: string;
  webinarjam_statut: "ok" | "erreur" | "non_configure";
  webinarjam_erreur: string;
  webinarjam_lien_live: string;
  event_id: string; // identifiant partagé Pixel / API Conversions
  user_agent: string;
};

export function leadStoreConfigured(): boolean {
  return Boolean(process.env.LEADS_WEBHOOK_URL);
}

export async function storeLead(lead: StoredLead): Promise<{ ok: boolean; error?: string }> {
  const url = process.env.LEADS_WEBHOOK_URL;
  if (!url) return { ok: false, error: "LEADS_WEBHOOK_URL manquant" };
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.LEADS_WEBHOOK_SECRET) headers["X-Webhook-Secret"] = process.env.LEADS_WEBHOOK_SECRET;
  // Deux tentatives : un webhook qui hoquette ne doit pas faire perdre un inscrit.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(lead),
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) return { ok: true };
      if (attempt === 1) return { ok: false, error: `HTTP ${res.status}` };
    } catch (err) {
      if (attempt === 1) return { ok: false, error: err instanceof Error ? err.message : String(err) };
    }
  }
  return { ok: false, error: "inconnu" };
}
