// Envoi de chaque inscrit dans systeme.io (côté serveur) : création du contact, puis
// ajout du tag qui déclenche l'automatisation (email de confirmation, séquence).
// API publique systeme.io : https://developer.systeme.io (clé dans Paramètres > Clés API publiques).
// [À TESTER avec la vraie clé : l'environnement de développement n'accède pas à api.systeme.io]

const BASE = process.env.SYSTEMEIO_API_URL || "https://api.systeme.io/api";

export type ContactSystemeIo = {
  prenom: string;
  email: string;
  telephoneE164: string;
  suivi?: Partial<Record<(typeof CHAMPS_SUIVI)[number], string>>;
};

// Provenance de l'inscrit, enregistrée dans des champs personnalisés systeme.io du même nom
// (à créer dans systeme.io : Paramètres > Champs personnalisés, slugs identiques).
export const CHAMPS_SUIVI = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"] as const;

// Envoyé à part, après le tag : si un champ n'existe pas dans systeme.io, l'inscription et
// l'email de confirmation ne sont pas affectés, l'erreur est seulement journalisée.
async function enregistrerSuivi(id: number, suivi: ContactSystemeIo["suivi"]) {
  const fields = CHAMPS_SUIVI.filter((k) => suivi?.[k]).map((k) => ({ slug: k, value: suivi![k]!.slice(0, 250) }));
  if (!fields.length) return;
  try {
    const res = await appel(`/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/merge-patch+json" },
      body: JSON.stringify({ fields }),
    });
    if (!res.ok) console.error("[systeme.io] UTM non enregistrés", res.status, await res.text().catch(() => ""));
  } catch (err) {
    console.error("[systeme.io] UTM non enregistrés", err);
  }
}

export function systemeIoConfigured(): boolean {
  return Boolean(process.env.SYSTEMEIO_API_KEY && process.env.SYSTEMEIO_TAG_ID);
}

async function appel(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "X-API-Key": process.env.SYSTEMEIO_API_KEY!,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init.headers || {}),
    },
    signal: AbortSignal.timeout(8000),
  });
}

// Retrouve l'identifiant d'un contact existant (même email déjà inscrit).
async function chercherContact(email: string): Promise<number | null> {
  const res = await appel(`/contacts?email=${encodeURIComponent(email)}`);
  if (!res.ok) return null;
  const data = (await res.json().catch(() => null)) as { items?: { id: number }[] } | null;
  return data?.items?.[0]?.id ?? null;
}

export async function inscrireDansSystemeIo(c: ContactSystemeIo): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await appel("/contacts", {
      method: "POST",
      body: JSON.stringify({
        email: c.email,
        locale: "fr",
        fields: [
          { slug: "first_name", value: c.prenom },
          { slug: "phone_number", value: c.telephoneE164 },
        ],
      }),
    });

    let id: number | null = null;
    if (res.ok) {
      const data = (await res.json().catch(() => null)) as { id?: number } | null;
      id = data?.id ?? null;
    }
    // Contact déjà présent (ancien inscrit, cliente…) : on le retrouve pour lui poser le tag.
    if (!id) id = await chercherContact(c.email);
    if (!id) return { ok: false, error: `création du contact impossible (HTTP ${res.status})` };

    const tag = await appel(`/contacts/${id}/tags`, {
      method: "POST",
      body: JSON.stringify({ tagId: Number(process.env.SYSTEMEIO_TAG_ID) }),
    });
    // 204 = tag posé ; 422 = le contact avait déjà ce tag (inscription en double) : pas une erreur.
    if (!tag.ok && tag.status !== 422) return { ok: false, error: `tag non posé (HTTP ${tag.status})` };
    await enregistrerSuivi(id, c.suivi);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
