import type { Metadata } from "next";
import { PageLegale } from "@/components/PageLegale";
import { EDITEUR, MISE_A_JOUR } from "@/content/legal";

export const metadata: Metadata = {
  title: "Politique de confidentialité · FineArt Académie",
  robots: { index: false },
};

export default function Page() {
  return (
    <PageLegale titre="Politique de confidentialité">
      <p>Dernière mise à jour : {MISE_A_JOUR}</p>
      <p>
        Cette page explique quelles données sont collectées quand tu t&apos;inscris au live gratuit de Benjamin, à
        quoi elles servent et comment exercer tes droits, conformément au Règlement général sur la protection des
        données (RGPD) et à la loi Informatique et Libertés.
      </p>

      <h2>Responsable du traitement</h2>
      <p>
        {EDITEUR.nom}, {EDITEUR.enseigne}, {EDITEUR.statut.toLowerCase()}, {EDITEUR.adresse}. SIRET :{" "}
        {EDITEUR.siret}.
        {EDITEUR.email && (
          <>
            {" "}
            Contact : <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a>.
          </>
        )}
      </p>

      <h2>Les données collectées</h2>
      <ul>
        <li>Celles que tu donnes dans le formulaire : ton prénom, ton adresse email et ton numéro de mobile.</li>
        <li>
          Des informations techniques : la page d&apos;où tu viens, les paramètres de la publicité qui t&apos;a
          amené ici (source, campagne), ton adresse IP et le type de navigateur utilisé.
        </li>
      </ul>

      <h2>À quoi elles servent</h2>
      <ul>
        <li>
          T&apos;inscrire au live et t&apos;envoyer tes accès, la confirmation et les rappels avant chaque soirée,
          par email et par SMS ou WhatsApp. Base légale : l&apos;exécution de ta demande d&apos;inscription.
        </li>
        <li>
          T&apos;envoyer ensuite des emails de Benjamin sur la photographie boudoir et ses formations. Base légale :
          l&apos;intérêt légitime. Tu peux te désinscrire à tout moment grâce au lien présent dans chaque email.
        </li>
        <li>
          Mesurer l&apos;efficacité des publicités et améliorer la page. Base légale : l&apos;intérêt légitime et,
          pour les cookies publicitaires, ton consentement.
        </li>
      </ul>

      <h2>Qui peut y accéder</h2>
      <p>
        Benjamin et les personnes qui l&apos;aident à organiser le live, ainsi que les prestataires techniques
        suivants, uniquement pour les besoins décrits ci-dessus :
      </p>
      <ul>
        <li>Vercel (hébergement du site) ;</li>
        <li>systeme.io (gestion des contacts et envoi des emails) ;</li>
        <li>WebinarJam (diffusion du live et rappels) ;</li>
        <li>Meta (mesure des publicités Facebook et Instagram) ;</li>
        <li>l&apos;outil interne de suivi des inscriptions.</li>
      </ul>
      <p>
        Certains de ces prestataires sont situés hors de l&apos;Union européenne, notamment aux États-Unis. Les
        transferts sont encadrés par les garanties prévues par le RGPD (décision d&apos;adéquation ou clauses
        contractuelles types de la Commission européenne).
      </p>

      <h2>Combien de temps elles sont conservées</h2>
      <p>
        Tes données sont conservées pendant 3 ans à compter de ton dernier échange avec Benjamin (ouverture
        d&apos;un email, inscription, réponse), puis supprimées. Si tu te désinscris, tu ne reçois plus aucun email.
      </p>

      <h2>Cookies et mesure d&apos;audience</h2>
      <ul>
        <li>
          Un cookie technique retient la version de la page qui t&apos;a été présentée, pendant 30 jours, pour que
          la page reste la même si tu reviens.
        </li>
        <li>
          Le pixel Meta mesure les visites et les inscriptions venant des publicités Facebook et Instagram. Tu peux
          refuser ce suivi dans les paramètres publicitaires de ton compte Facebook ou Instagram, ou en bloquant les
          cookies tiers dans ton navigateur.
        </li>
      </ul>

      <h2>Tes droits</h2>
      <p>
        Tu peux à tout moment accéder à tes données, les faire corriger ou supprimer, t&apos;opposer à leur
        utilisation, en limiter l&apos;usage ou demander à les récupérer.
        {EDITEUR.email ? (
          <>
            {" "}
            Il suffit d&apos;écrire à <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a>.
          </>
        ) : (
          <> Il suffit de répondre à l&apos;un des emails reçus après ton inscription, ou d&apos;écrire à l&apos;adresse postale ci-dessus.</>
        )}{" "}
        Une réponse t&apos;est apportée sous un mois.
      </p>
      <p>
        Si tu estimes que tes droits ne sont pas respectés, tu peux adresser une réclamation à la CNIL (
        <a href="https://www.cnil.fr" target="_blank" rel="noopener">cnil.fr</a>).
      </p>
    </PageLegale>
  );
}
