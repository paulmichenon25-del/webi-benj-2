# Live boudoir · 18 et 19 octobre 2026

Landing page d'inscription (`/`) et page de remerciement (`/merci`) du webinaire de la FineArt Académie.
Next.js (App Router), mobile-first, déployable tel quel sur Vercel.

## Lancer en local

```bash
npm install
cp .env.example .env.local   # puis remplir les variables
npm run dev                  # http://localhost:3000
```

Sans aucune intégration configurée, le formulaire fonctionne en dev (l'inscrit est affiché dans la console).
En production, sans WebinarJam ni webhook, l'API refuse l'inscription plutôt que de perdre le contact.

## Avant de lancer les pubs

```bash
npm run check:placeholders   # liste tout ce qui reste à fournir / valider
npm test                     # téléphone E.164, dates d'agenda, .ics
```

Fichiers à déposer dans `public/` (le placeholder disparaît automatiquement au build suivant) :

| Fichier | Où |
|---|---|
| `benjamin-hero.jpg` | Hero (avatar sur mobile, grande photo dessous / à droite sur desktop) |
| `benjamin-studio.jpg` | Section « Moi, c'est Benjamin » (facultatif, sinon la photo du hero) |
| `benjamin-merci.mp4` (+ `benjamin-merci.jpg` en aperçu) | Vidéo de la page merci, format vertical |
| `temoignages/<slug>.mp4` et/ou `temoignages/<slug>.jpg` | Témoignages : `nicolas`, `jessica`, `samantha`, `benjamin-m` (voir `content/temoignages.ts`) |

Vidéos : H.264, 720p, < 8 Mo idéalement. Elles ne se chargent qu'au clic.

## Ce qui se passe à l'inscription

`POST /api/inscription` (serveur, aucune clé exposée au navigateur) :

1. Validation (prénom, email, mobile normalisé en E.164, segment).
2. Inscription WebinarJam (`WEBINARJAM_*`). Le téléphone n'est transmis à WebinarJam que si la case de consentement SMS/WhatsApp est cochée.
3. Envoi de l'inscrit au webhook `LEADS_WEBHOOK_URL` avec : prénom, email, téléphone E.164, segment, consentement, `utm_source/medium/campaign/content/term`, `fbclid`, URL de la landing, URL de provenance, statut WebinarJam, lien live personnel, `event_id`.
4. Événement `Lead` vers l'API Conversions Meta (si `META_PIXEL_ID` + `META_CAPI_TOKEN`), dédoublonné avec le Pixel déclenché sur `/merci`.

Si WebinarJam échoue mais que le webhook passe (ou l'inverse), la personne est quand même redirigée vers `/merci` et la ligne du webhook porte `webinarjam_statut: "erreur"` pour la rattraper à la main.

### Coût par inscrit par pub

Les UTM sont lus dans l'URL d'arrivée et gardés pendant la session. Paramètres d'URL conseillés dans Meta :

```
utm_source=facebook&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}
```

`utm_content` = nom de la pub → regrouper les inscrits par `utm_content` et diviser par la dépense de la pub.

## Page merci

- Prénom repris de l'inscription.
- Google Agenda + `.ics` (Apple / Outlook) pour chaque soirée, 20h heure de Paris, rappels 1h et 10 min avant. Le lien live personnel renvoyé par WebinarJam est mis dans l'événement ; sinon `NEXT_PUBLIC_WEBINAR_LIVE_URL`.
- Bloc WhatsApp affiché seulement si `NEXT_PUBLIC_WHATSAPP_URL` est renseigné.
