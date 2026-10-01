import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="conteneur">
        <nav aria-label="Informations légales" className={styles.liens}>
          <a href="/mentions-legales">Mentions légales</a>
          <a href="/confidentialite">Politique de confidentialité</a>
        </nav>
        <p>© {new Date().getFullYear()} FineArt Académie</p>
        <p className={styles.meta}>
          Ce site ne fait pas partie du site Facebook ou de Meta Platforms, Inc. et n&apos;est pas approuvé par
          Facebook.
        </p>
      </div>
    </footer>
  );
}
