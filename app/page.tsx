import { BoutonInscription, InscriptionProvider } from "@/components/Inscription";
import { CtaMobile } from "@/components/CtaMobile";
import { Portrait } from "@/components/Portrait";
import { Footer } from "@/components/Footer";
import { VideoPresentation } from "@/components/VideoPresentation";
import {
  CADEAU_INSCRIPTION,
  CADEAU_LIVE,
  POSTER_PRESENTATION,
  VIDEO_PRESENTATION,
} from "@/content/evenement";
import { TEMOIGNAGES, URL_TEMOIGNAGES } from "@/content/temoignages";
import { publicFileExists } from "@/lib/assets";
import styles from "./page.module.css";

// Gabarit repris du live de juillet (live.benjaminphoto.space) : pastille « Live offert »,
// grand visuel avec badge, carte événement, objections, programme par soirée, intervenant,
// FAQ et carte finale. Couleurs : crème, noir, cuivre #BC6C2E sur les détails.

const PHOTO_HERO = "/benjamin-hero.jpg"; // [IMAGE À FOURNIR : /public/benjamin-hero.jpg]
const PHOTO_PORTRAIT = "/benjamin-portrait.jpg"; // [IMAGE À FOURNIR : portrait carré, sinon la photo du hero]

const DOULEURS = [
  "« Novembre arrive, et mon agenda se vide. »",
  "« Lundi, 6h45, je retourne au vrai travail. »",
  "« Instagram a encore retiré ma plus belle photo. »",
  "« C'est combien la séance ? On peut s'arranger ? »",
];

const FAQ: { q: string; r: string }[] = [
  { q: "C'est vraiment gratuit ?", r: "Oui. Deux soirées en direct, sans carte bancaire. Tu t'inscris, tu reçois ton lien par email, tu viens." },
  {
    q: "Je ne fais pas encore de boudoir, c'est pour moi ?",
    r: "Oui. Si tu fais du mariage, du portrait ou de la grossesse, tes futures clientes boudoir sont déjà dans tes contacts. Je te montre comment l'intégrer sans changer d'image.",
  },
  { q: "Je débute, c'est trop tôt ?", r: "Non. Certains photographes que j'accompagne sont partis de zéro. Autant poser les bonnes bases dès le début." },
  { q: "Il faut un studio ?", r: "Non. Le boudoir se fait en intérieur, et tu peux commencer sans studio. J'en parle pendant le live." },
  {
    q: "Je ne peux être là qu'à une soirée ?",
    r: "Inscris-toi quand même et bloque les deux si tu peux. L'annonce de fin du lundi est réservée aux personnes présentes en direct.",
  },
  { q: "C'est technique (lumière, matériel) ?", r: "Non. On ne parle ni de lumière ni de réglages. On parle clientes, offre et prix." },
];

export default function Page() {
  const videoPresentation = publicFileExists(VIDEO_PRESENTATION) ? VIDEO_PRESENTATION : undefined;
  const photoHero = publicFileExists(PHOTO_HERO) ? PHOTO_HERO : undefined;
  const posterPresentation = publicFileExists(POSTER_PRESENTATION) ? POSTER_PRESENTATION : photoHero;
  const portrait = publicFileExists(PHOTO_PORTRAIT) ? PHOTO_PORTRAIT : PHOTO_HERO;

  return (
    <InscriptionProvider>
      <main>
        {/* ============ HERO ============ */}
        <section id="hero" className={styles.hero}>
          <div className={`conteneur ${styles.heroCentre}`}>
            <span className="surtitre">
              <span className="pulse" aria-hidden="true" /> Live offert · Dim. 18 et lun. 19 octobre · 20h
            </span>

            {/*
              Variantes de H1 proposées (la n°1 est intégrée) :
              1. « Vivre du boudoir à plein temps, toute l'année. »
              2. « Vivre du boudoir, toute l'année. La méthode, en direct, en 2 soirées. »
              3. « Le boudoir peut te faire vivre de la photo à plein temps. »
              4. « Tes clientes, ton offre, ton prix : vivre du boudoir toute l'année. »
              5. « Et si le boudoir te permettait de vivre de la photo, toute l'année ? »
            */}
            <h1 className={styles.h1}>
              Vivre du boudoir à plein temps, <span className={styles.cuivre}>toute l&apos;année.</span>
            </h1>

            <div className={styles.heroMedia}>
              <VideoPresentation src={videoPresentation} poster={posterPresentation} duree="2 min" />
              <span className={styles.badgeGratuit}>Gratuit</span>
              <span className={styles.badgeLive}>
                <span className={styles.liveDot} aria-hidden="true" /> 2 soirées en direct
              </span>
            </div>

            <p className={styles.lede}>
              En direct, je te montre comment <b>trouver tes premières clientes boudoir</b>, construire ton offre
              premium, et à quel prix la vendre pour en vivre.
            </p>

            <BoutonInscription className={styles.heroBouton}>
              Je réserve ma place gratuite <span aria-hidden="true">→</span>
            </BoutonInscription>

            <div className={styles.confiance}>
              <span><span className="check">✓</span> 100 % gratuit</span>
              <span><span className="check">✓</span> En direct avec moi</span>
              <span><span className="check">✓</span> Boudoir ou pas encore</span>
              <span><span className="check">✓</span> Un cadeau dès l&apos;inscription</span>
            </div>

            <p className={styles.legende}>
              <b>Benjamin Hanachowicz</b> · Photographe boudoir à Roanne
            </p>
          </div>
        </section>

        {/* ============ CARTE ÉVÉNEMENT ============ */}
        <div className={`conteneur ${styles.cadreEvent}`}>
          <aside className={styles.event}>
            <span className={styles.eventBadge}>2 soirées en direct</span>
            <div className={styles.eventDates}>
              <div className={styles.quand}>
                <span className={styles.quandJour}>18</span>
                <span className={styles.quandMois}>octobre · dim.</span>
                <span className={styles.quandHeure}>20h</span>
              </div>
              <div className={styles.quand}>
                <span className={styles.quandJour}>19</span>
                <span className={styles.quandMois}>octobre · lun.</span>
                <span className={styles.quandHeure}>20h</span>
              </div>
            </div>
            <div className={styles.eventLignes}>
              <div><span>Format</span><b>Live en ligne</b></div>
              <div><span>Tarif</span><b>0 € · sans CB</b></div>
              <div><span>En direct avec</span><b>Benjamin Hanachowicz</b></div>
              <div><span>Pour</span><b>Photographes boudoir et futurs</b></div>
            </div>
            <BoutonInscription plein>Je réserve ma place <span aria-hidden="true">→</span></BoutonInscription>
          </aside>
        </div>

        <div className="conteneur">
          <p className={styles.reassurance}>
            <span className="check">✓</span>
            <span>
              <b>Ce n&apos;est pas un live technique.</b> Pas de réglages, pas de matériel : on parle de ce qui te
              fait vivre, tes clientes, ton offre, ton prix.
            </span>
          </p>
        </div>

        {/* ============ TU TE RECONNAIS ? (objections) ============ */}
        <section className={`section section--sable ${styles.sectionHaute}`}>
          <div className="conteneur">
            <div className="entete-section">
              <span className="surtitre">Tu te reconnais ?</span>
              <h2>Ce qui te freine n&apos;est pas ton talent</h2>
            </div>
            <div className={styles.objections}>
              {DOULEURS.map((d) => (
                <p key={d} className={styles.objection}>{d}</p>
              ))}
            </div>
            <p className={styles.reponse}>
              Le boudoir se fait <b>en intérieur, en semaine, toute l&apos;année</b>, avec le matériel que tu as déjà.
              Et son prix ne se négocie pas.
            </p>
          </div>
        </section>

        {/* ============ PIVOT / VOCATION ============ */}
        <section className={styles.citation}>
          <div className="conteneur etroit">
            <p className={styles.citationTexte}>
              Une femme n&apos;achète pas des fichiers.{" "}
              <span className={styles.cuivreVif}>Elle achète le jour où elle s&apos;est trouvée belle.</span>
            </p>
            <p className={styles.citationSuite}>
              Le boudoir, c&apos;est d&apos;abord un accompagnement. En vivre toute l&apos;année, c&apos;est la
              conséquence de bien le faire.
            </p>
          </div>
        </section>

        {/* ============ POUR QUI ============ */}
        <section className="section">
          <div className="conteneur">
            <div className="entete-section">
              <span className="surtitre">Pour qui</span>
              <h2>Ces deux soirées sont pour toi si…</h2>
            </div>
            <div className={styles.cibles}>
              <article className={styles.cible}>
                <span className={styles.cibleTag}>Profil 1</span>
                <h3>Tu fais déjà du boudoir</h3>
                <p>Tes clientes repartent transformées, mais ton agenda fait encore le yoyo.</p>
              </article>
              <article className={styles.cible}>
                <span className={styles.cibleTag}>Profil 2</span>
                <h3>Tu fais du mariage, du portrait, de la grossesse</h3>
                <p>Tes futures clientes boudoir, tu les as déjà dans tes contacts.</p>
              </article>
            </div>
            <p className={styles.debutants}>
              Tu débutes en photo ? Viens aussi. Certains photographes que j&apos;accompagne sont partis de zéro.
            </p>
          </div>
        </section>

        {/* ============ PROGRAMME ============ */}
        {/* [À CONFIRMER : découpage exact du contenu entre les deux soirées] */}
        <section className="section section--sable">
          <div className="conteneur">
            <div className="entete-section">
              <span className="surtitre">Le programme</span>
              <h2>Ce que je te montre en direct</h2>
            </div>
            <div className={styles.programme}>
              <article className={styles.soiree}>
                <span className={styles.soireeTag}>Soirée 1 · Dim. 18 octobre · 20h</span>
                <h3>Trouver tes clientes</h3>
                <ol>
                  <li><span>01</span>Pourquoi le boudoir fait vivre de la photo toute l&apos;année</li>
                  <li><span>02</span>Où trouver tes premières clientes, y compris parmi tes anciennes clientes</li>
                  <li><span>03</span>Le message exact à leur envoyer, dès le lendemain</li>
                </ol>
              </article>
              <article className={`${styles.soiree} ${styles.soireeForte}`}>
                <span className={styles.soireeTag}>Soirée 2 · Lun. 19 octobre · 20h</span>
                <h3>Ton offre et ton prix</h3>
                <ol>
                  <li><span>01</span>Construire une offre premium que tes clientes ont envie de s&apos;offrir</li>
                  <li><span>02</span>À quel prix la vendre pour en vivre, sans négocier</li>
                  <li><span>03</span>Une annonce réservée aux personnes présentes en direct</li>
                </ol>
              </article>
            </div>

            {/* [À CONFIRMER : contenu des deux cadeaux, voir content/evenement.ts] */}
            <div className={styles.cadeaux}>
              <div className={styles.cadeau}>
                <span className={styles.cadeauQuand}>Cadeau · dès ton inscription</span>
                <b>{CADEAU_INSCRIPTION.titre}</b>
              </div>
              <div className={styles.cadeau}>
                <span className={styles.cadeauQuand}>Cadeau · réservé aux présents</span>
                <b>{CADEAU_LIVE.titre}</b>
              </div>
            </div>
            <p className={styles.cadeauxNote}>
              <span className="a-valider">[À CONFIRMER : contenu des cadeaux]</span>
            </p>

            <div className="texte-centre">
              <BoutonInscription>Je réserve ma place <span aria-hidden="true">→</span></BoutonInscription>
            </div>
          </div>
        </section>

        {/* ============ INTERVENANT ============ */}
        <section className="section">
          <div className="conteneur">
            <div className="entete-section">
              <span className="surtitre">Ton intervenant</span>
              <h2>Qui anime ce live</h2>
            </div>
            <div className={styles.intervenant}>
              <div className={styles.photoRonde}>
                <Portrait src={portrait} alt="Benjamin Hanachowicz" variante="grand" sizes="220px" />
              </div>
              <p className={styles.role}>Il anime les deux soirées</p>
              <p className={styles.nom}>Benjamin Hanachowicz</p>
              <p className={styles.ligne}>
                Photographe boudoir à Roanne. Je vis <b>à 100 % de mes séances</b>, toute l&apos;année. Ce que
                j&apos;aime dans ce métier : le moment où une femme découvre ses photos et se regarde autrement.
              </p>
              <span className={styles.tagChiffre}>
                <span className="a-valider">[CHIFFRE À VALIDER]</span> photographes accompagnés dans la FineArt
                Académie
              </span>
            </div>
          </div>
        </section>

        {/* ============ TÉMOIGNAGES : lien vers la page complète ============ */}
        <section className={styles.temoignagesSection}>
          <div className="conteneur">
            <a className={styles.temoignages} href={URL_TEMOIGNAGES} target="_blank" rel="noopener">
              <span className={styles.visages} aria-hidden="true">
                {TEMOIGNAGES.map((t) => (
                  <span key={t.slug}>{t.nom.charAt(0)}</span>
                ))}
                <span>+</span>
              </span>
              <span className={styles.temoignagesTexte}>
                <span className={styles.temoignagesSur}>Témoignages</span>
                <span className={styles.temoignagesTitre}>Ils et elles l&apos;ont fait avant toi</span>
                <span className={styles.temoignagesNoms}>
                  {TEMOIGNAGES.map((t) => t.nom.split(" · ")[0]).join(", ")} et les autres racontent leur
                  parcours.
                </span>
              </span>
              <span className={styles.temoignagesBouton}>
                Voir tous les témoignages <span aria-hidden="true">→</span>
              </span>
            </a>
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section className="section section--sable">
          <div className="conteneur">
            <div className="entete-section">
              <span className="surtitre">Questions fréquentes</span>
              <h2>Tout ce que tu te demandes</h2>
            </div>
            <div className={styles.faq}>
              {FAQ.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.r}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ============ CTA FINAL ============ */}
        <section id="cta-final" className={styles.final}>
          <div className="conteneur">
            <div className={styles.carteFinale}>
              <span className="surtitre">
                <span className="pulse" aria-hidden="true" /> Dernière étape
              </span>
              <h2>Dimanche 18 et lundi 19 octobre, 20h. Ta place t&apos;attend.</h2>
              <p>Si tu aimes ce métier, on va passer deux belles soirées. Viens avec tes questions.</p>
              <div className={styles.tableau}>
                <div><span>Soirée 1</span><b>Dim. 18 oct. · 20h</b></div>
                <div><span>Soirée 2</span><b>Lun. 19 oct. · 20h</b></div>
                <div><span>Format</span><b>Live en ligne</b></div>
                <div><span>Tarif</span><b>Gratuit</b></div>
              </div>
              <BoutonInscription plein className={styles.boutonFinal}>
                Je réserve ma place gratuite <span aria-hidden="true">→</span>
              </BoutonInscription>
              <p className={styles.avertissement}>Annonce réservée aux personnes présentes en direct le lundi.</p>
              <p className={styles.signature}>Je t&apos;attends. Benjamin</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <CtaMobile />
    </InscriptionProvider>
  );
}
