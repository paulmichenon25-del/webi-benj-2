// Variantes de la landing pour l'A/B test.
// Règle : une variante ne change qu'une chose à la fois par rapport à sa référence,
// sinon on ne sait pas ce qui a fait la différence.
//   A (photo) vs B (vidéo)  → teste le visuel du hero, tout le reste est identique.
//   C (angle « autres photographes ») → même visuel que A, teste le message du hero.

export type VarianteId = "a" | "b" | "c";

export type Variante = {
  id: VarianteId;
  nom: string; // nom interne, stocké avec chaque inscrit
  media: "image" | "video";
  titre: string;
  titreEm: string; // fin du titre, en italique cuivre
  lede: string; // reprend mot pour mot la promesse des pubs
  ciblesAutresDabord: boolean; // met le profil « mariage, portrait, grossesse » en premier
};

const LEDE_PUBS =
  "En direct, je te montre comment trouver tes premières clientes boudoir, construire ton offre premium, et à quel prix la vendre pour en vivre.";

export const VARIANTES: Record<VarianteId, Variante> = {
  a: {
    id: "a",
    nom: "A · photo",
    media: "image",
    titre: "Vivre de la photo toute l'année, grâce au boudoir.",
    titreEm: "Je te montre comment, en direct.",
    lede: LEDE_PUBS,
    ciblesAutresDabord: false,
  },
  b: {
    id: "b",
    nom: "B · vidéo",
    media: "video",
    titre: "Vivre de la photo toute l'année, grâce au boudoir.",
    titreEm: "Je te montre comment, en direct.",
    lede: LEDE_PUBS,
    ciblesAutresDabord: false,
  },
  c: {
    id: "c",
    nom: "C · autres photographes",
    media: "image",
    titre: "Mariage, portrait, grossesse : le boudoir peut te faire vivre de la photo à plein temps.",
    titreEm: "Je te montre la méthode, en direct.",
    lede: LEDE_PUBS,
    ciblesAutresDabord: true,
  },
};

export const IDS_VARIANTES = Object.keys(VARIANTES) as VarianteId[];

export function estVariante(v: string | undefined | null): v is VarianteId {
  return !!v && v in VARIANTES;
}

// Variantes en test sur « / » (répartition égale). Modifiable sans toucher au code :
// AB_VARIANTES=a,b dans les variables d'environnement. Par défaut « b » seule (vidéo), sans test.
export function variantesActives(): VarianteId[] {
  const env = (process.env.AB_VARIANTES || "b").split(",").map((s) => s.trim());
  const ids = env.filter(estVariante);
  return ids.length ? ids : ["a"];
}

export const COOKIE_VARIANTE = "fa_variante";
