import { BoutonInscription, InscriptionProvider } from "@/components/Inscription";
import { CtaMobile } from "@/components/CtaMobile";
import { Portrait } from "@/components/Portrait";
import { Temoignages, type TemoignageMedia } from "@/components/Temoignages";
import { Footer } from "@/components/Footer";
import { TEMOIGNAGES, URL_TEMOIGNAGES } from "@/content/temoignages";
import { publicFileExists } from "@/lib/assets";
import styles from "./page.module.css";

const PHOTO_HERO = "/benjamin-hero.jpg"; // [IMAGE À FOURNIR : /public/benjamin-hero.jpg]
const PHOTO_PRESENTATION = "/benjamin-studio.jpg"; // [IMAGE À FOURNIR : facultatif, sinon la photo du hero est reprise]

const FAQ: { q: string; r: string }[] = [
  {
    q: "C'est vraiment gratuit ?",
    r: "Oui. Deux soirées en direct, sans carte bancaire et sans piège. Tu t'inscris, tu reçois ton lien par email, tu viens.",
  },
  {
    q: "Je ne fais pas encore de boudoir, c'est pour moi ?",
    r: "Oui. Si tu fais du mariage, du portrait, de la grossesse ou de la famille, tes futures clientes boudoir sont déjà dans tes contacts. Je te montre comment intégrer le boudoir à ton activité, sans changer d'image.",
  },
  {
    q: "Je débute, c'est trop tôt ?",
    r: "Non. Certains photographes que j'accompagne sont partis de zéro, sans avoir jamais touché un appareil photo. Le live parle de clientes, d'offre et de prix. Autant poser ces bases dès le début.",
  },
  {
    q: "Il faut un studio ?",
    r: "Non. Le boudoir se fait en intérieur, et tu peux commencer sans studio. J'en parle pendant le live.",
  },
  {
    q: "Je ne peux être là qu'à une soirée ?",
    r: "Inscris-toi quand même. Les deux soirées se suivent : la première pour trouver tes clientes, la deuxième pour construire ton offre et fixer ton prix. Si tu peux, bloque les deux dès maintenant. L'annonce de la fin du lundi est réservée aux personnes présentes en direct.",
  },
  {
    q: "C'est technique (lumière, matériel) ?",
    r: "Non, ce n'est pas un live technique. On ne parle ni de lumière ni de réglages. On parle de ce qui te permet d'en vivre : tes clientes, ton offre, ton prix.",
  },
];

export default function Page() {
  const temoignages: TemoignageMedia[] = TEMOIGNAGES.map((t) => {
    const video = `/temoignages/${t.slug}.mp4`;
    const image = `/temoignages/${t.slug}.jpg`;
    return {
      ...t,
      video: publicFileExists(video) ? video : undefined,
      image: publicFileExists(image) ? image : undefined,
    };
  });
  const photoPresentation = publicFileExists(PHOTO_PRESENTATION) ? PHOTO_PRESENTATION : PHOTO_HERO;

  return (
    <InscriptionProvider>
      <main>
        {/* ============ 1. HERO ============ */}
        <section id="hero" className={styles.hero}>
          <div className={`conteneur ${styles.heroGrille}`}>
            <div className={styles.heroTexte}>
              <p className={styles.heroSurtitre}>2 soirées de live gratuites · 18 et 19 octobre · 20h</p>

              {/*
                Variantes de H1 proposées (la n°1 est intégrée) :
                1. « Vivre du boudoir à plein temps, toute l'année. Je te montre comment, en direct. »
                2. « Vivre du boudoir, toute l'année. La méthode, en direct, en 2 soirées. »
                3. « Le boudoir peut te faire vivre de la photo à plein temps. Je te montre comment en 2 soirées. »
                4. « Tes clientes, ton offre, ton prix : 2 soirées pour vivre du boudoir toute l'année. »
                5. « Et si le boudoir te permettait de vivre de la photo, toute l'année ? »
                Pourquoi la n°1 : elle porte l'idée « à plein temps, toute l'année » des pubs,
                elle est en première personne (« je te montre »), et elle ne promet rien
                d'autre que ce que Benjamin fait vraiment pendant le live.
              */}
              <h1 className={styles.h1}>
                Vivre du boudoir à plein temps, toute l&apos;année.{" "}
                <em>Je te montre comment, en direct.</em>
              </h1>

              <div className={styles.signature}>
                <Portrait src={PHOTO_HERO} alt="Benjamin Hanachowicz" variante="avatar" priority />
                <p>
                  <strong>Benjamin Hanachowicz</strong>
                  <br />
                  Photographe boudoir à Roanne
                </p>
              </div>

              <p className={styles.sousTitre}>
                2 soirées en direct avec moi pour te montrer comment trouver tes premières clientes boudoir,
                construire ton offre premium, et à quel prix la vendre pour en vivre. Pour les photographes boudoir
                qui veulent en vivre, et pour ceux qui veulent l&apos;intégrer à leur activité.
              </p>

              <ul className={styles.bulles}>
                <li>100 % gratuit</li>
                <li>En direct avec moi les 18 et 19 oct. à 20h</li>
                <li>Que tu fasses déjà du boudoir ou pas encore</li>
              </ul>

              <BoutonInscription plein className={styles.heroBouton} />
            </div>

            <div className={styles.heroPhoto}>
              <Portrait
                src={PHOTO_HERO}
                alt="Benjamin Hanachowicz dans son studio boudoir à Roanne"
                variante="grand"
                priority
              />
            </div>
          </div>
        </section>

        {/* ============ 2. TU TE RECONNAIS ? ============ */}
        <section className="section section--sable">
          <div className="conteneur etroit">
            <h2>Tu te reconnais ?</h2>
            <div className={styles.scene}>
              <p>Novembre arrive, et ton agenda se vide.</p>
              <p>Lundi, le réveil sonne à 6h45 pour retourner au « vrai » travail.</p>
              <p>Instagram vient encore de retirer une de tes plus belles photos.</p>
              <p>
                Et cette cliente qui te demande « c&apos;est combien la séance ? », puis « on peut
                s&apos;arranger ? ».
              </p>
            </div>
            <p className="lead">Je connais. Et ça ne dit rien de ton talent.</p>
          </div>
        </section>

        {/* ============ 3. LE PIVOT ============ */}
        <section className="section">
          <div className="conteneur etroit">
            <span className="surtitre">Pourquoi le boudoir change tout</span>
            <h2>Une prestation qui te fait vivre en janvier comme en juillet</h2>
            <ul className={styles.atouts}>
              <li>
                <strong>En intérieur, en semaine, toute l&apos;année.</strong> Pas besoin d&apos;attendre la saison
                des mariages ni le beau temps.
              </li>
              <li>
                <strong>Avec le matériel que tu as déjà.</strong> Pas d&apos;investissement à faire avant de
                commencer.
              </li>
              <li>
                <strong>Un prix qui ne se négocie pas.</strong> Parce qu&apos;une femme n&apos;achète pas des
                fichiers. Elle achète le jour où elle s&apos;est trouvée belle.
              </li>
            </ul>
            <blockquote className={styles.vocation}>
              <p>
                Mais je vais être honnête avec toi : le boudoir n&apos;est pas un bon plan pour remplir un agenda.
                C&apos;est d&apos;abord un accompagnement.
              </p>
              <p>
                Une femme arrive un peu stressée. Elle te fait confiance, elle se dévoile, et elle repart en se
                regardant autrement. C&apos;est ça, le métier.
              </p>
              <p>
                Vivre du boudoir toute l&apos;année, c&apos;est la conséquence de bien le faire. Pas le point de
                départ.
              </p>
            </blockquote>
          </div>
        </section>

        {/* ============ 4. POUR QUI ============ */}
        <section className="section section--sable">
          <div className="conteneur">
            <h2 className="texte-centre">Ces deux soirées sont pour toi si…</h2>
            <div className={styles.cartes}>
              <article className={styles.carte}>
                <h3>Tu fais déjà du boudoir</h3>
                <p>
                  Tu aimes ces séances, tes clientes repartent transformées, mais ton agenda fait encore le yoyo.
                  Imagine-le rempli toute l&apos;année, à un prix qui te permet enfin d&apos;en vivre.
                </p>
              </article>
              <article className={styles.carte}>
                <h3>Tu fais du mariage, du portrait, de la grossesse</h3>
                <p>
                  Tes futures clientes boudoir, tu les as déjà. La mariée d&apos;il y a trois ans, la maman que tu as
                  photographiée enceinte, celle qui va fêter ses 40 ans. Imagine leur proposer le boudoir, sans
                  changer d&apos;image.
                </p>
              </article>
            </div>
            <p className={styles.debutants}>
              Tu débutes en photo ? Viens aussi. Certains photographes que j&apos;accompagne sont partis de zéro,
              sans avoir jamais touché un appareil photo.
            </p>
          </div>
        </section>

        {/* ============ 5. PROGRAMME ============ */}
        {/* [À CONFIRMER : découpage exact du contenu entre les deux soirées] */}
        <section className="section">
          <div className="conteneur">
            <span className="surtitre">Le programme</span>
            <h2>Ce que je te montre pendant ces deux soirées</h2>
            <div className={styles.programme}>
              <article className={styles.soiree}>
                <p className={styles.soireeDate}>Soirée 1 · Dimanche 18 octobre · 20h</p>
                <h3>Trouver tes clientes</h3>
                <ol>
                  <li>Pourquoi le boudoir est la prestation qui permet de vivre de la photo toute l&apos;année.</li>
                  <li>Où trouver tes premières clientes boudoir, y compris parmi tes anciennes clientes.</li>
                  <li>Le message exact à envoyer à tes anciennes clientes, à utiliser dès le lendemain.</li>
                </ol>
              </article>
              <article className={styles.soiree}>
                <p className={styles.soireeDate}>Soirée 2 · Lundi 19 octobre · 20h</p>
                <h3>Construire ton offre et la vendre au bon prix</h3>
                <ol>
                  <li>Comment construire une offre premium que tes clientes ont envie de s&apos;offrir.</li>
                  <li>À quel prix la vendre pour en vivre toute l&apos;année, sans négocier.</li>
                  <li>Une annonce réservée aux personnes présentes en direct.</li>
                </ol>
              </article>
            </div>
            <p className={styles.promesse}>
              Tu repars avec le message exact à envoyer à tes anciennes clientes.
            </p>
            <div className="texte-centre">
              <BoutonInscription />
            </div>
          </div>
        </section>

        {/* ============ 6. BENJAMIN ============ */}
        <section className="section section--nuit">
          <div className={`conteneur ${styles.bio}`}>
            <div className={styles.bioPhoto}>
              <Portrait
                src={photoPresentation}
                alt="Benjamin Hanachowicz, photographe boudoir"
                variante="grand"
              />
            </div>
            <div>
              <span className="surtitre">Qui suis-je</span>
              <h2>Moi, c&apos;est Benjamin</h2>
              <p>
                Je suis photographe boudoir à Roanne. Je vis à 100 % de mes séances boudoir, toute l&apos;année.
              </p>
              <p>
                Si je fais ce métier, ce n&apos;est pas pour l&apos;agenda. C&apos;est pour ce moment, à la fin de la
                séance, où une femme découvre ses photos et ne dit plus rien. Elle était arrivée en me disant « je
                ne suis pas photogénique ». Elle repart en se regardant autrement.
              </p>
              <p>
                Aujourd&apos;hui, j&apos;accompagne aussi <span className="a-valider">[CHIFFRE À VALIDER]</span>{" "}
                photographes boudoir dans la FineArt Académie. Certains en vivent déjà. D&apos;autres sont partis de
                zéro.
              </p>
              <p>
                Je te préviens : je suis plus à l&apos;aise derrière un appareil que devant une webcam. Mais pour ces
                deux soirées, je fais un effort.
              </p>
            </div>
          </div>
        </section>

        {/* ============ 7. TÉMOIGNAGES ============ */}
        <section className="section">
          <div className="conteneur">
            <h2>Les photographes que j&apos;accompagne en parlent mieux que moi</h2>
            <Temoignages items={temoignages} />
            <p className={styles.lienTemoignages}>
              <a href={URL_TEMOIGNAGES} target="_blank" rel="noopener">
                Voir tous les témoignages
              </a>
            </p>
          </div>
        </section>

        {/* ============ 8. FAQ ============ */}
        <section className="section section--sable">
          <div className="conteneur etroit">
            <h2>Tes questions</h2>
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

        {/* ============ 9. CTA FINAL ============ */}
        <section id="cta-final" className={`section ${styles.final}`}>
          <div className="conteneur etroit texte-centre">
            <span className="surtitre">2 soirées de live gratuites</span>
            <h2>Dimanche 18 et lundi 19 octobre, 20h</h2>
            <p className="lead">
              Si tu aimes ce métier, on va passer deux belles soirées. Viens avec tes questions, je serai là pour y
              répondre.
            </p>
            <p className={styles.signatureFin}>Je t&apos;attends. Benjamin</p>
            <BoutonInscription plein className={styles.boutonFinal} />
          </div>
        </section>
      </main>
      <Footer />
      <CtaMobile />
    </InscriptionProvider>
  );
}
