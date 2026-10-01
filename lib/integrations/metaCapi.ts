import { createHash } from "node:crypto";

// Événement « Lead » envoyé à l'API Conversions de Meta, dédoublonné avec le
// Pixel grâce au même event_id. Optionnel : actif seulement si les deux
// variables META_PIXEL_ID et META_CAPI_TOKEN sont renseignées.

const sha256 = (v: string) => createHash("sha256").update(v.trim().toLowerCase()).digest("hex");

export type CapiLead = {
  eventId: string;
  email: string;
  phoneE164: string;
  prenom: string;
  ip?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  sourceUrl?: string;
};

export function metaCapiConfigured(): boolean {
  return Boolean(process.env.META_PIXEL_ID && process.env.META_CAPI_TOKEN);
}

export async function sendCapiLead(l: CapiLead): Promise<void> {
  if (!metaCapiConfigured()) return;
  const userData: Record<string, unknown> = {
    em: [sha256(l.email)],
    ph: [sha256(l.phoneE164.replace(/\D/g, ""))],
    fn: [sha256(l.prenom)],
  };
  if (l.ip) userData.client_ip_address = l.ip;
  if (l.userAgent) userData.client_user_agent = l.userAgent;
  if (l.fbp) userData.fbp = l.fbp;
  if (l.fbc) userData.fbc = l.fbc;
  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: l.eventId,
        action_source: "website",
        event_source_url: l.sourceUrl,
        user_data: userData,
      },
    ],
  };
  if (process.env.META_CAPI_TEST_EVENT_CODE) payload.test_event_code = process.env.META_CAPI_TEST_EVENT_CODE;
  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${process.env.META_PIXEL_ID}/events?access_token=${process.env.META_CAPI_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!res.ok) console.error("[meta-capi]", res.status, await res.text().catch(() => ""));
  } catch (err) {
    console.error("[meta-capi]", err);
  }
}
