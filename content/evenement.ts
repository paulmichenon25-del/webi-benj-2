// Habillage de l'événement, inspiré du funnel Déclic (Shootiful) :
// un nom d'événement, une vidéo courte en tête de page, un cadeau dès
// l'inscription et un cadeau réservé aux présents en direct.

// [À CONFIRMER : nom de l'événement] Autres pistes : « Révélée », « L'Écrin ».
export const NOM_EVENEMENT = "Plein Temps";

// Vidéo de présentation (2 min max, format 16:9) en tête de page.
// [VIDÉO À FOURNIR : /public/benjamin-presentation.mp4] (+ .jpg en aperçu)
export const VIDEO_PRESENTATION = "/benjamin-presentation.mp4";
export const POSTER_PRESENTATION = "/benjamin-presentation.jpg";

// Cadeaux volontairement mystérieux sur la page : le contenu se découvre par email et en live.
export const CADEAU_INSCRIPTION = {
  titre: "Un cadeau mystère",
  texte: "Je ne te dis rien. Ouvre tes emails juste après ton inscription.",
};

export const CADEAU_LIVE = {
  titre: "Des outils… et une grosse annonce",
  texte:
    "Calcul de prix, templates, et d'autres choses que je garde pour le live. Si tu n'es pas là, tu passes à côté.",
};

// Page merci. [VIDÉO À FOURNIR : /public/benjamin-merci.mp4] (+ .jpg en aperçu), format 16:9.
export const VIDEO_MERCI = "/benjamin-merci.mp4";
export const POSTER_MERCI = "/benjamin-merci.jpg";

// Lien d'invitation du groupe WhatsApp privé (NEXT_PUBLIC_WHATSAPP_URL dans Vercel pour le changer sans toucher au code).
export const WHATSAPP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://chat.whatsapp.com/Hl0fILz0BsuKwAapGSL3Vr";
