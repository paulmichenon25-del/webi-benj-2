// Liste tout ce qui reste à fournir / valider avant de lancer les pubs.
// Usage : npm run check:placeholders  (code de sortie 1 s'il reste des repères)
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const RE = /\[(?:CHIFFRE À VALIDER|CONTENU À FOURNIR|IMAGE À FOURNIR|VIDÉO À FOURNIR|À CONFIRMER)[^\]]*\]/g;
const DIRS = ["app", "components", "content", "lib"];
let total = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|css)$/.test(name)) {
      readFileSync(p, "utf8").split("\n").forEach((line, i) => {
        for (const m of line.matchAll(RE)) {
          total++;
          console.log(`${p}:${i + 1}  ${m[0]}`);
        }
      });
    }
  }
}

DIRS.forEach(walk);
console.log(total ? `\n${total} repère(s) à traiter avant lancement.` : "Aucun repère restant.");
process.exit(total ? 1 : 0);
