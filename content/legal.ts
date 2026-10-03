// Identité de l'éditeur, reprise des factures de Benjamin (Fine Art Boudoir).
// EMAIL_CONTACT : laissé vide tant qu'il n'est pas confirmé ; la ligne est alors masquée.
export const EDITEUR = {
  nom: "Benjamin Hanachowicz",
  enseigne: "Fine Art Boudoir (FineArt Académie)",
  statut: "Entrepreneur individuel",
  adresse: "13 rue Brison, 42300 Roanne, France",
  siret: "512 604 596 00050",
  tva: "FR50512604596",
  email: process.env.NEXT_PUBLIC_EMAIL_CONTACT || "",
};

export const MISE_A_JOUR = "3 octobre 2026";
