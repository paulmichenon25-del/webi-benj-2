import type { Metadata } from "next";
import { PageLegale } from "@/components/PageLegale";
import { EDITEUR, MISE_A_JOUR } from "@/content/legal";

export const metadata: Metadata = { title: "Mentions légales · FineArt Académie", robots: { index: false } };

export default function Page() {
  return (
    <PageLegale titre="Mentions légales">
      <p>Dernière mise à jour : {MISE_A_JOUR}</p>

      <h2>Éditeur du site</h2>
      <p>
        {EDITEUR.nom}, {EDITEUR.enseigne}
        <br />
        {EDITEUR.statut}
        <br />
        {EDITEUR.adresse}
        <br />
        SIRET : {EDITEUR.siret}
        <br />
        TVA intracommunautaire : {EDITEUR.tva}
        {EDITEUR.email && (
          <>
            <br />
            Email : <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a>
          </>
        )}
      </p>

      <h2>Directeur de la publication</h2>
      <p>{EDITEUR.nom}</p>

      <h2>Hébergement</h2>
      <p>
        Vercel Inc.
        <br />
        440 N Barranca Ave #4133, Covina, CA 91723, États-Unis
        <br />
        <a href="https://vercel.com" target="_blank" rel="noopener">vercel.com</a>
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus de ce site (textes, photographies, vidéos, logos, mise en page) appartient à{" "}
        {EDITEUR.nom} ou est utilisé avec l&apos;accord de ses auteurs. Toute reproduction, représentation ou
        diffusion, totale ou partielle, sans autorisation écrite préalable est interdite.
      </p>

      <h2>Responsabilité</h2>
      <p>
        Les informations publiées sur ce site sont fournies à titre indicatif. L&apos;éditeur s&apos;efforce de les
        tenir à jour mais ne peut garantir l&apos;absence d&apos;erreur. Les résultats évoqués dépendent du travail
        et de la situation de chacun et ne constituent pas une promesse de gain.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Le traitement de tes données lors de ton inscription est décrit dans la{" "}
        <a href="/confidentialite">politique de confidentialité</a>.
      </p>

      <h2>Droit applicable</h2>
      <p>Le présent site et ces mentions sont soumis au droit français.</p>
    </PageLegale>
  );
}
