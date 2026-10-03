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
      </div>
    </footer>
  );
}
