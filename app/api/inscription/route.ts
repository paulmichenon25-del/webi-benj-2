import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import {
  SEGMENTS,
  normalizeMobile,
  sanitizeTracking,
  validateLead,
  type LeadInput,
  type Segment,
} from "@/lib/lead";
import { registerToWebinarJam, webinarJamConfigured } from "@/lib/integrations/webinarjam";
import { leadStoreConfigured, storeLead, type StoredLead } from "@/lib/integrations/leadStore";
import { sendCapiLead } from "@/lib/integrations/metaCapi";
import { inscrireDansSystemeIo, systemeIoConfigured } from "@/lib/integrations/systemeio";

export const runtime = "nodejs";

function clientIp(req: NextRequest): string | undefined {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || undefined;
}

export async function POST(req: NextRequest) {
  let body: Partial<LeadInput>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  const input: LeadInput = {
    prenom: String(body.prenom ?? "").trim(),
    email: String(body.email ?? "").trim().toLowerCase(),
    telephone: String(body.telephone ?? ""),
    pays: String(body.pays ?? "FR"),
    segment: String(body.segment ?? ""),
    consentementRappels: body.consentementRappels === true,
    tracking: sanitizeTracking(body.tracking),
    website: String(body.website ?? ""),
  };

  // Pot de miel rempli : on répond « ok » sans rien enregistrer.
  if (input.website) return NextResponse.json({ ok: true, eventId: randomUUID() });

  const errors = validateLead(input);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const phone = normalizeMobile(input.telephone, input.pays)!;
  const ip = clientIp(req);
  const userAgent = req.headers.get("user-agent") || "";
  const eventId = randomUUID();

  if (!webinarJamConfigured() && !leadStoreConfigured() && !systemeIoConfigured()) {
    if (process.env.NODE_ENV === "production") {
      console.error("[inscription] Aucune intégration configurée, inscription perdue :", input.email);
      return NextResponse.json(
        { ok: false, error: "Les inscriptions sont momentanément indisponibles. Réessaie dans quelques minutes." },
        { status: 503 },
      );
    }
    console.info("[inscription] mode dev, aucune intégration configurée :", { ...input, phone: phone.e164 });
    return NextResponse.json({ ok: true, eventId, liveUrl: "" });
  }

  // systeme.io (contact + tag → email de confirmation) en parallèle de WebinarJam.
  const sioPromise = systemeIoConfigured()
    ? inscrireDansSystemeIo({ prenom: input.prenom, email: input.email, telephoneE164: phone.e164 })
    : Promise.resolve(null);

  const wj = webinarJamConfigured()
    ? await registerToWebinarJam({
        prenom: input.prenom,
        email: input.email,
        ip,
        phone: input.consentementRappels ? phone : undefined,
      })
    : null;
  if (wj && !wj.ok) console.error("[inscription] WebinarJam :", wj.error, input.email);
  const sio = await sioPromise;
  if (sio && !sio.ok) console.error("[inscription] systeme.io :", sio.error, input.email);

  const lead: StoredLead = {
    inscrit_le: new Date().toISOString(),
    prenom: input.prenom,
    email: input.email,
    telephone_e164: phone.e164,
    segment: input.segment,
    segment_libelle: SEGMENTS[input.segment as Segment],
    consentement_rappels_sms_whatsapp: input.consentementRappels,
    utm_source: input.tracking.utm_source ?? "",
    utm_medium: input.tracking.utm_medium ?? "",
    utm_campaign: input.tracking.utm_campaign ?? "",
    utm_content: input.tracking.utm_content ?? "",
    utm_term: input.tracking.utm_term ?? "",
    fbclid: input.tracking.fbclid ?? "",
    page_url: input.tracking.page_url ?? "",
    referrer: input.tracking.referrer ?? "",
    variante_landing: input.tracking.variante ?? "",
    webinarjam_statut: wj === null ? "non_configure" : wj.ok ? "ok" : "erreur",
    webinarjam_erreur: wj && !wj.ok ? wj.error : "",
    webinarjam_lien_live: wj?.ok ? wj.liveUrl ?? "" : "",
    systemeio_statut: sio === null ? "non_configure" : sio.ok ? "ok" : "erreur",
    event_id: eventId,
    user_agent: userAgent,
  };

  const stored = leadStoreConfigured() ? await storeLead(lead) : null;
  if (stored && !stored.ok) console.error("[inscription] Webhook inscrits :", stored.error, JSON.stringify(lead));

  // L'inscrit est perdu seulement si toutes les intégrations configurées ont échoué.
  const saved = Boolean(wj?.ok || stored?.ok || sio?.ok);
  if (!saved) {
    return NextResponse.json(
      { ok: false, error: "Ton inscription n'est pas passée. Réessaie dans un instant." },
      { status: 502 },
    );
  }

  const fbp = req.cookies.get("_fbp")?.value;
  const fbcCookie = req.cookies.get("_fbc")?.value;
  const fbc =
    fbcCookie || (input.tracking.fbclid ? `fb.1.${Date.now()}.${input.tracking.fbclid}` : undefined);
  await sendCapiLead({
    eventId,
    email: input.email,
    phoneE164: phone.e164,
    prenom: input.prenom,
    ip,
    userAgent,
    fbp,
    fbc,
    sourceUrl: input.tracking.page_url,
  });

  return NextResponse.json({ ok: true, eventId, liveUrl: lead.webinarjam_lien_live });
}
