import { existsSync } from "node:fs";
import path from "node:path";

// Vrai si le fichier existe dans /public. Évalué au build : il suffit de déposer
// l'image ou la vidéo au bon endroit et de redéployer pour remplacer le placeholder.
export function publicFileExists(publicPath: string): boolean {
  return existsSync(path.join(process.cwd(), "public", publicPath.replace(/^\//, "")));
}
