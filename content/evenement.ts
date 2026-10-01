// Habillage de l'événement, inspiré du funnel Déclic (Shootiful) :
// un nom d'événement, une vidéo courte en tête de page, un cadeau dès
// l'inscription et un cadeau réservé aux présents en direct.

// [À CONFIRMER : nom de l'événement] Autres pistes : « Révélée », « L'Écrin ».
export const NOM_EVENEMENT = "Plein Temps";

// Vidéo de présentation (2 min max, format 16:9) en tête de page.
// [VIDÉO À FOURNIR : /public/benjamin-presentation.mp4] (+ .jpg en aperçu)
export const VIDEO_PRESENTATION = "/benjamin-presentation.mp4";
export const POSTER_PRESENTATION = "/benjamin-presentation.jpg";

// [À CONFIRMER : contenu des deux cadeaux]
export const CADEAU_INSCRIPTION = {
  titre: "Ton carnet de préparation boudoir",
  texte:
    "Tu le reçois dès ton inscription. Quelques pages à remplir avant le live : qui sont tes clientes, ce que tu proposes aujourd'hui, ce qui te bloque. Tu arrives le dimanche avec une longueur d'avance.",
};

export const CADEAU_LIVE = {
  titre: "Mon outil de calcul de prix",
  texte:
    "Je le donne pendant la soirée 2, uniquement aux personnes présentes en direct. Il te montre le prix de séance dont tu as besoin pour vivre du boudoir toute l'année.",
};
