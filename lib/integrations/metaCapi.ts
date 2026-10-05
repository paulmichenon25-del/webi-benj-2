import { createHash } from "node:crypto";

// Événement « CompleteRegistration » envoyé à l'API Conversions de Meta, dédoublonné avec le
// Pixel navigateur grâce au même event_id. Actif dès que META_CAPI_TOKEN est renseigné.

const PIXEL_ID = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID || "1031384306524044";

const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");
const normaliser = (v: string) => v.trim().toLowerCase().replace(/\s+/g, "");

export type CapiInscription = {
  eventId: string;
  email: string;
  phoneE164?: string;
  prenom?: string;
  ip?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  sourceUrl?: string;
};

export function metaCapiConfigured(): boolean {
  return Boolean(process.env.META_CAPI_TOKEN);
}

// Ne lève jamais d'erreur : un échec côté Meta ne doit pas bloquer l'inscription.
export async function sendCapiCompleteRegistration(l: CapiInscription): Promise<void> {
  if (!metaCapiConfigured()) return;
  try {
    const userData: Record<string, unknown> = { em: [sha256(normaliser(l.email))] };
    if (l.prenom) userData.fn = [sha256(normaliser(l.prenom))];
    const tel = (l.phoneE164 || "").replace(/\D/g, ""); // format international sans « + »
    if (tel) userData.ph = [sha256(tel)];
    if (l.ip) userData.client_ip_address = l.ip;
    if (l.userAgent) userData.client_user_agent = l.userAgent;
    if (l.fbp) userData.fbp = l.fbp;
    if (l.fbc) userData.fbc = l.fbc;

    const payload: Record<string, unknown> = {
      data: [
        {
          event_name: "CompleteRegistration",
          event_time: Math.floor(Date.now() / 1000),
          event_id: l.eventId,
          action_source: "website",
          event_source_url: l.sourceUrl,
          user_data: userData,
        },
      ],
    };
    const testCode = process.env.META_TEST_EVENT_CODE || process.env.META_CAPI_TEST_EVENT_CODE;
    if (testCode) payload.test_event_code = testCode;

    const res = await fetch(
      `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${encodeURIComponent(process.env.META_CAPI_TOKEN!)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      },
    );
    const reponse = await res.text().catch(() => "");
    if (!res.ok) console.error("[meta-capi]", res.status, reponse);
    // Réponse de Meta visible dans les logs Vercel (ex. {"events_received":1,...}) pour vérifier l'envoi.
    else console.info("[meta-capi] ok", l.eventId, reponse);
  } catch (err) {
    console.error("[meta-capi]", err);
  }
}
