import Image from "next/image";
import { publicFileExists } from "@/lib/assets";
import styles from "./Portrait.module.css";

// Photo de Benjamin, ou placeholder propre tant que le fichier n'est pas déposé dans /public.
export function Portrait({
  src,
  alt,
  variante,
  priority = false,
  sizes,
}: {
  src: string;
  alt: string;
  variante: "avatar" | "grand";
  priority?: boolean;
  sizes?: string;
}) {
  const existe = publicFileExists(src);
  const cls = `${styles.cadre} ${variante === "avatar" ? styles.avatar : styles.grand}`;
  if (!existe) {
    return (
      <div className={`${cls} ${styles.placeholder}`} role="img" aria-label={alt}>
        {variante === "avatar" ? (
          <span className={styles.initiales}>BH</span>
        ) : (
          <span className="a-valider">[IMAGE À FOURNIR : {src}]</span>
        )}
      </div>
    );
  }
  return (
    <div className={cls}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? (variante === "avatar" ? "48px" : "(min-width: 900px) 440px, 100vw")}
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}
