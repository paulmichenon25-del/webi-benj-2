import { BoutonInscription, InscriptionProvider } from "@/components/Inscription";
import { CtaMobile } from "@/components/CtaMobile";
import { Portrait } from "@/components/Portrait";
import { Footer } from "@/components/Footer";
import { VideoPresentation } from "@/components/VideoPresentation";
import { WistiaVideo } from "@/components/WistiaVideo";
import { CompteARebours } from "@/components/CompteARebours";
import {
  CADEAU_INSCRIPTION,
  CADEAU_LIVE,
  POSTER_PRESENTATION,
  VIDEO_PRESENTATION,
  WISTIA_PRESENTATION,
} from "@/content/evenement";
import { TEMOIGNAGES, URL_TEMOIGNAGES } from "@/content/temoignages";
import { publicFileExists } from "@/lib/assets";
import type { Variante } from "@/content/variantes";
import styles from "@/app/page.module.css";

// Gabarit repris du live de juillet (live.benjaminphoto.space) : pastille « Live offert »,
// grand visuel avec badge, carte événement, objections, programme par soirée, intervenant,
// FAQ et carte finale. Couleurs : crème, noir, cuivre #BC6C2E sur les détails.

const PHOTO_HERO = "/benjamin-hero.jpg"; // facultative : à défaut, la photo portrait est utilisée
const PHOTO_PORTRAIT = "/benjamin-portrait.jpg"; // photo fournie par Paul

const DOULEURS = [
  "« Je me brade pour remplir mon agenda. »",
  "« Je suis en concurrence avec tous les autres photographes boudoir. »",
  "« On compare mes tarifs, on me demande de faire un prix. »",
  "« Mon agenda est plein un mois, vide le suivant. »",
  "« Instagram a encore retiré ma plus belle photo. »",
];

const FAQ: { q: string; r: string }[] = [
  { q: "C'est vraiment gratuit ?", r: "Oui. Deux soirées en direct, sans carte bancaire. Tu t'inscris, tu reçois ton lien par email, tu viens." },
  {
    q: "Je ne fais pas encore de boudoir, c'est pour moi ?",
    r: "Oui. Si tu fais du mariage, du portrait ou de la grossesse, tes futures clientes boudoir sont déjà dans tes contacts. Je te montre comment l'intégrer sans changer d'image.",
  },
  {
    q: "Je débute, c'est trop tôt ?",
    r: "Non, pas du tout. Même si tu n'as jamais tenu un appareil photo de ta vie, si tu as envie de faire du boudoir, c'est possible. Certains photographes que j'accompagne sont partis de là.",
  },
  { q: "Il faut un studio ?", r: "Non. Le boudoir se fait en intérieur, et tu peux commencer sans studio. J'en parle pendant le live." },
  {
    q: "Je ne peux être là qu'à une soirée ?",
    r: "Inscris-toi quand même, mais bloque les deux si tu peux. Chaque soir, je fais des annonces et je donne des bonus réservés aux personnes présentes en direct. Ils ne sont pas retransmis ensuite.",
  },
];

export function Landing({ variante }: { variante: Variante }) {
  const videoPresentation = publicFileExists(VIDEO_PRESENTATION) ? VIDEO_PRESENTATION : undefined;
  const photoHero = publicFileExists(PHOTO_HERO) ? PHOTO_HERO : undefined;
  const posterPresentation = publicFileExists(POSTER_PRESENTATION) ? POSTER_PRESENTATION : photoHero;
  const portrait = publicFileExists(PHOTO_PORTRAIT) ? PHOTO_PORTRAIT : PHOTO_HERO;

  return (
    <InscriptionProvider variante={variante.nom}>
      <main className={styles.landing}>
        {/* ============ HERO ============ */}
        <section id="hero" className={styles.hero}>
          <div className={`conteneur ${styles.heroCentre}`}>
            <p className={styles.eyebrow}>
              <span className="pulse" aria-hidden="true" /> Live gratuit · 18 & 19 oct. · 20h
            </p>

            <h1 className={variante.id === "c" ? `${styles.h1} ${styles.h1Long}` : styles.h1}>
              {variante.titre} <em>{variante.titreEm}</em>
            </h1>

            {/* Vidéo : Wistia (WISTIA_PRESENTATION) ou, à défaut, /public/benjamin-presentation.mp4.
                Sans l'un ni l'autre, le bloc n'apparaît pas. */}
            {variante.media === "video" ? (
              (WISTIA_PRESENTATION || videoPresentation) && (
                <div className={styles.heroMedia}>
                  {WISTIA_PRESENTATION ? (
                    <WistiaVideo mediaId={WISTIA_PRESENTATION} titre="Le mot de Benjamin" />
                  ) : (
                    <VideoPresentation src={videoPresentation} poster={posterPresentation} duree="2 min" />
                  )}
                </div>
              )
            ) : (
              <div className={styles.heroMedia}>
                <div className={styles.heroImage}>
                  <Portrait
                    src={photoHero ?? PHOTO_PORTRAIT}
                    alt="Benjamin Hanachowicz dans son studio boudoir à Roanne"
                    variante="grand"
                    priority
                    sizes="(min-width: 800px) 760px, 100vw"
                  />
                </div>
              </div>
            )}

            <BoutonInscription className={styles.heroBouton}>
              Je réserve ma place gratuite <span aria-hidden="true">→</span>
            </BoutonInscription>

            <p className={styles.sousBouton}>100 % gratuit · 2 soirées en direct</p>
          </div>
        </section>

        {/* ============ PROMESSE (reprend mot pour mot les pubs) ============ */}
        <section className={styles.promesse}>
          <div className="conteneur etroit">
            <p>{variante.lede}</p>
            <ul className={styles.bulles}>
              <li><span className="check">✓</span>Débutant ou déjà lancé</li>
              <li><span className="check">✓</span>La méthode complète</li>
            </ul>
            <p className={styles.signatureHero}>
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
            <CompteARebours variante="sombre" />
          </aside>
        </div>


        {/* ============ POUR QUI ============ */}
        <section className={`section ${styles.sectionHaute}`}>
          <div className="conteneur">
            <div className="entete-section">
              <span className="surtitre">Pour qui</span>
              <h2>Ces deux soirées sont <em>pour toi si…</em></h2>
              <p>Tu aimes accompagner les femmes avec bienveillance, pas seulement les photographier.</p>
            </div>
            <div className={variante.ciblesAutresDabord ? `${styles.cibles} ${styles.ciblesInverse}` : styles.cibles}>
              <article className={styles.cible}>
                <span className={styles.cibleTag}>Tu fais déjà du boudoir</span>
                <h3>En vivre enfin à plein temps</h3>
                <p>Tu es en concurrence avec les autres photographes boudoir, on compare tes tarifs, ton agenda fait le yoyo. Il te manque la bonne méthode : ton positionnement, ta stratégie de contenu, ton prix.</p>
              </article>
              <article className={styles.cible}>
                <span className={styles.cibleTag}>Tu fais mariage, portrait, grossesse…</span>
                <h3>Ajouter la prestation qui te fera vivre toute l&apos;année</h3>
                <p>Le boudoir vient en complément de ce que tu fais déjà. Tes futures clientes sont déjà dans tes contacts, et tu l&apos;intègres sans changer d&apos;image.</p>
              </article>
            </div>
            <p className={styles.debutants}>
              Tu débutes ? Viens aussi. Même sans avoir jamais tenu un appareil photo, c&apos;est possible.
            </p>
          </div>
        </section>

        {/* ============ PROGRAMME ============ */}
        {/* [À CONFIRMER : découpage exact du contenu entre les deux soirées] */}
        <section className="section section--sable">
          <div className="conteneur">
            <div className="entete-section">
              <span className="surtitre">Le programme</span>
              <h2>Ce que je te montre <em>en direct</em></h2>
            </div>
            <div className={styles.programme}>
              <article className={styles.soiree}>
                <span className={styles.soireeTag}>Soirée 1 · Dim. 18 octobre · 20h</span>
                <h3>Créer l&apos;offre boudoir qui te fait vivre toute l&apos;année</h3>
                <ol>
                  <li><span>01</span>Pourquoi le boudoir est la prestation qui fait vivre de la photo à plein temps</li>
                  <li><span>02</span>Construire ton offre premium, que tu fasses déjà du boudoir ou pas encore</li>
                  <li><span>03</span>Fixer ton prix pour en vivre toute l&apos;année, sans négocier</li>
                  <li className={styles.bonusLive}><span>+</span>Bonus et annonce réservés aux présents</li>
                </ol>
              </article>
              <article className={`${styles.soiree} ${styles.soireeForte}`}>
                <span className={styles.soireeTag}>Soirée 2 · Lun. 19 octobre · 20h</span>
                <h3>Trouver tes clientes</h3>
                <ol>
                  <li><span>01</span>Où trouver tes clientes boudoir, y compris dans tes contacts actuels</li>
                  <li><span>02</span>Le message exact à leur envoyer pour qu&apos;elles réservent</li>
                  <li><span>03</span>Les premières actions à lancer dès le lendemain du live</li>
                  <li className={styles.bonusLive}><span>+</span>Bonus et annonce réservés aux présents</li>
                </ol>
              </article>
            </div>

            <div className={styles.cadeaux}>
              <div className={styles.cadeau}>
                <span className={styles.cadeauQuand}>Dès ton inscription</span>
                <b>{CADEAU_INSCRIPTION.titre}</b>
                <span className={styles.cadeauTexte}>{CADEAU_INSCRIPTION.texte}</span>
              </div>
              <div className={styles.cadeau}>
                <span className={styles.cadeauQuand}>Réservé aux présents</span>
                <b>{CADEAU_LIVE.titre}</b>
                <span className={styles.cadeauTexte}>{CADEAU_LIVE.texte}</span>
              </div>
            </div>
            <div className={styles.cadeauxNote} />

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
              <h2>Moi, c&apos;est <em>Benjamin</em></h2>
            </div>
            <div className={styles.intervenant}>
              <div className={styles.photoRonde}>
                <Portrait src={portrait} alt="Benjamin Hanachowicz" variante="grand" sizes="220px" cadrage="38% 40%" />
              </div>
              <p className={styles.role}>J&apos;anime les deux soirées</p>
              <p className={styles.nom}>Benjamin Hanachowicz</p>
              <p className={styles.ligne}>
                Photographe boudoir à Roanne. Je vis <b>à 100 % de mes séances</b>, toute l&apos;année. Ce que
                j&apos;aime dans ce métier : le moment où une femme découvre ses photos et se regarde autrement.
              </p>
              <span className={styles.tagChiffre}>
                Une quarantaine de photographes accompagnés dans la FineArt Académie
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

        {/* ============ TU TE RECONNAIS ? (objections) ============ */}
        <section className="section section--sable">
          <div className="conteneur">
            <div className="entete-section">
              <span className="surtitre">Tu te reconnais ?</span>
              <h2>Ce qui te freine <em>n&apos;est pas ton talent</em></h2>
            </div>
            <div className={styles.objections}>
              {DOULEURS.map((d) => (
                <p key={d} className={styles.objection}>{d}</p>
              ))}
            </div>
            <p className={styles.reponse}>
              Le problème n&apos;est ni ton matériel ni ton œil. C&apos;est l&apos;absence de méthode : <b>un
              positionnement à toi, une offre premium et une stratégie de contenu</b> qui attire les bonnes clientes.
            </p>
          </div>
        </section>

        {/* ============ LA SOLUTION : LE BOUDOIR AVEC LA BONNE MÉTHODE ============ */}
        <section className="section">
          <div className="conteneur">
            <div className="entete-section">
              <span className="surtitre">La solution</span>
              <h2>
                Le boudoir, avec la bonne méthode, <em>c&apos;est ce qui fait vivre de la photo à plein temps</em>
              </h2>
              <p>
                Que tu fasses déjà du boudoir ou du mariage, du portrait, de la grossesse : c&apos;est la prestation
                qui remplit un agenda toute l&apos;année.
              </p>
            </div>
            <div className={styles.comparatif}>
              <div className={styles.comparatifAvant}>
                <span className={styles.comparatifTitre}>Ce que vivent la plupart des photographes</span>
                <ul>
                  <li>Une saison chargée, puis des mois creux</li>
                  <li>Des prix tirés vers le bas par la concurrence</li>
                  <li>Des clientes qui comparent et négocient</li>
                  <li>Un travail à côté pour tenir l&apos;année</li>
                </ul>
              </div>
              <div className={styles.comparatifApres}>
                <span className={styles.comparatifTitre}>Le boudoir, avec la bonne méthode</span>
                <ul>
                  <li>Quelques séances par mois suffisent pour vivre confortablement</li>
                  <li>Ton propre positionnement : on ne te compare plus aux autres</li>
                  <li>Ta propre stratégie de contenu, qui attire les bonnes clientes</li>
                  <li>Une offre premium, un prix qui ne se négocie pas, toute l&apos;année</li>
                </ul>
              </div>
            </div>
            <div className="texte-centre">
              <BoutonInscription>Je veux découvrir la méthode <span aria-hidden="true">→</span></BoutonInscription>
            </div>
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

        {/* ============ FAQ ============ */}
        <section className="section section--sable">
          <div className="conteneur">
            <div className="entete-section">
              <span className="surtitre">Questions fréquentes</span>
              <h2>Tout ce que <em>tu te demandes</em></h2>
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
              <h2>Dimanche 18 et lundi 19 octobre, 20h. <em>Ta place t&apos;attend.</em></h2>
              <p>Si tu aimes ce métier, on va passer deux belles soirées. Viens avec tes questions.</p>
              <CompteARebours variante="blocs" />
              <div className={styles.tableau}>
                <div><span>Soirée 1</span><b>Dim. 18 oct. · 20h</b></div>
                <div><span>Soirée 2</span><b>Lun. 19 oct. · 20h</b></div>
                <div><span>Format</span><b>Live en ligne</b></div>
                <div><span>Tarif</span><b>Gratuit</b></div>
              </div>
              <BoutonInscription plein className={styles.boutonFinal}>
                Je réserve ma place gratuite <span aria-hidden="true">→</span>
              </BoutonInscription>
              <p className={styles.avertissement}>Chaque soir : bonus et annonces réservés aux personnes présentes en direct. Rien n'est retransmis.</p>
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
