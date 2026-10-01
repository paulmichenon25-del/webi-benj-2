// Inscription WebinarJam via l'API officielle (côté serveur uniquement).
// Doc : https://documentation.webinarjam.com/  → endpoint « register ».

type RegisterParams = {
  prenom: string;
  email: string;
  ip?: string;
  // Transmis uniquement si la personne a accepté les rappels SMS/WhatsApp.
  phone?: { countryCallingCode: string; nationalNumber: string };
};

export type WebinarJamResult = { ok: true; liveUrl?: string } | { ok: false; error: string };

export function webinarJamConfigured(): boolean {
  return Boolean(process.env.WEBINARJAM_API_KEY && process.env.WEBINARJAM_WEBINAR_ID);
}

// WEBINARJAM_SCHEDULE_IDS : un ou plusieurs identifiants de session, séparés par
// des virgules. Si les deux soirées sont deux sessions distinctes du même webinaire,
// on inscrit la personne aux deux. [À CONFIRMER : configuration WebinarJam]
function scheduleIds(): string[] {
  const ids = (process.env.WEBINARJAM_SCHEDULE_IDS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return ids.length ? ids : ["0"];
}

async function registerOnce(p: RegisterParams, schedule: string): Promise<WebinarJamResult> {
  const body = new URLSearchParams({
    api_key: process.env.WEBINARJAM_API_KEY!,
    webinar_id: process.env.WEBINARJAM_WEBINAR_ID!,
    first_name: p.prenom,
    email: p.email,
    schedule,
  });
  if (p.ip) body.set("ip_address", p.ip);
  if (p.phone) {
    body.set("phone_country_code", `+${p.phone.countryCallingCode}`);
    body.set("phone", p.phone.nationalNumber);
  }
  try {
    const res = await fetch("https://api.webinarjam.com/webinarjam/register", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json().catch(() => null)) as
      | { status?: string; message?: string; user?: { live_room_url?: string } }
      | null;
    if (!res.ok || data?.status !== "success") {
      return { ok: false, error: data?.message || `HTTP ${res.status}` };
    }
    return { ok: true, liveUrl: data.user?.live_room_url };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function registerToWebinarJam(p: RegisterParams): Promise<WebinarJamResult> {
  const results = await Promise.all(scheduleIds().map((id) => registerOnce(p, id)));
  const failed = results.find((r) => !r.ok);
  if (failed) return failed;
  const liveUrl = results.map((r) => (r.ok ? r.liveUrl : undefined)).find(Boolean);
  return { ok: true, liveUrl };
}
