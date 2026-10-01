import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_VARIANTE, estVariante, variantesActives } from "@/content/variantes";

// A/B test sur « / » : chaque visiteur reçoit une variante au hasard (répartition égale
// entre AB_VARIANTES) et la garde 30 jours grâce à un cookie. L'URL ne change pas,
// les UTM restent intacts. « /?v=b » force une variante.
export function proxy(request: NextRequest) {
  const actives = variantesActives();
  const forcee = request.nextUrl.searchParams.get("v");
  const cookie = request.cookies.get(COOKIE_VARIANTE)?.value;

  let variante: string;
  if (estVariante(forcee)) variante = forcee;
  else if (estVariante(cookie) && actives.includes(cookie)) variante = cookie;
  else variante = actives[Math.floor(Math.random() * actives.length)];

  const url = request.nextUrl.clone();
  url.pathname = `/v/${variante}`;
  const res = NextResponse.rewrite(url);
  if (cookie !== variante) {
    res.cookies.set(COOKIE_VARIANTE, variante, { maxAge: 60 * 60 * 24 * 30, path: "/", sameSite: "lax" });
  }
  return res;
}

export const config = {
  matcher: "/",
};
