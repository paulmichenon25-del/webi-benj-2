import Script from "next/script";
import styles from "./VideoPresentation.module.css";

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "wistia-player": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "media-id": string;
        aspect?: string;
      };
    }
  }
}

// Vidéo hébergée sur Wistia (code d'intégration officiel), dans le même cadre arrondi que le reste du site.
// Pas de lecture automatique : réglée dans Wistia. L'aperçu flouté s'affiche le temps que le lecteur charge.
export function WistiaVideo({ mediaId, titre }: { mediaId: string; titre: string }) {
  return (
    <div className={styles.cadre}>
      <Script src="https://fast.wistia.com/player.js" strategy="afterInteractive" />
      <Script src={`https://fast.wistia.com/embed/${mediaId}.js`} strategy="afterInteractive" type="module" />
      <style>{`wistia-player[media-id='${mediaId}']:not(:defined){background:center / contain no-repeat url('https://fast.wistia.com/embed/medias/${mediaId}/swatch');display:block;filter:blur(5px);padding-top:56.25%;}`}</style>
      <wistia-player media-id={mediaId} aspect="1.7777777777777777" aria-label={titre} />
    </div>
  );
}
