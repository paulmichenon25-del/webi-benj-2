// Témoignages d'élèves. Pour chaque personne, dépose dans /public/temoignages :
//   - <slug>.mp4 : vidéo légère (idéalement < 8 Mo, 720p, H.264, format vertical 9:16)
//   - <slug>.jpg : image d'aperçu de la vidéo, ou capture d'écran si pas de vidéo
// Si la vidéo existe, elle est affichée (lecture au clic). Sinon la capture.
// Sinon un placeholder visible. Ne jamais inventer de chiffre ni de citation.
// [CONTENU À FOURNIR : vidéos ou captures + légende validée par chaque élève]

export type Temoignage = {
  slug: string;
  nom: string;
  legende: string; // une ligne de contexte, validée par l'élève
};

export const TEMOIGNAGES: Temoignage[] = [
  { slug: "nicolas", nom: "Nicolas", legende: "[CONTENU À FOURNIR : légende]" },
  { slug: "jessica", nom: "Jessica", legende: "[CONTENU À FOURNIR : légende]" },
  { slug: "samantha", nom: "Samantha · Échappe et Belle", legende: "[CONTENU À FOURNIR : légende]" },
  { slug: "benjamin-m", nom: "Benjamin", legende: "[CONTENU À FOURNIR : légende]" },
];

export const URL_TEMOIGNAGES = "https://temoignages.fineart-academie.com";
