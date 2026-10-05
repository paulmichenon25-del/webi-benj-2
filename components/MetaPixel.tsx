"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

// Pixel Meta du live. NEXT_PUBLIC_META_PIXEL_ID permet de le changer sans toucher au code.
export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1031384306524044";

type Fbq = ((...args: unknown[]) => void) & { callMethod?: unknown };

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

// Attend que le code de base du Pixel ait défini window.fbq (script chargé en afterInteractive).
function quandFbqPret(action: () => void) {
  if (window.fbq) return action();
  let essais = 0;
  const t = window.setInterval(() => {
    if (window.fbq || ++essais > 40) {
      window.clearInterval(t);
      if (window.fbq) action();
    }
  }, 125);
}

// Dernier chemin envoyé en PageView. Au niveau du module pour survivre au double
// montage du mode strict de React : une même page ne part qu'une fois.
let dernierePageVue: string | null = null;

function PageViews() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname || pathname === dernierePageVue) return;
    dernierePageVue = pathname;
    quandFbqPret(() => window.fbq!("track", "PageView"));
  }, [pathname]);
  return null;
}

// Code de base du Pixel (init seulement) + PageView au chargement et à chaque changement de route.
export function MetaPixel() {
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${PIXEL_ID}');`}
      </Script>
      <PageViews />
    </>
  );
}

// Balise de secours pour les navigateurs sans JavaScript.
export function MetaPixelNoscript() {
  return (
    <noscript>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        alt=""
        src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
      />
    </noscript>
  );
}

// Inscription confirmée : même eventID que l'événement envoyé à l'API Conversions.
export function trackCompleteRegistration(eventId: string) {
  quandFbqPret(() => window.fbq!("track", "CompleteRegistration", {}, { eventID: eventId }));
}

const STORAGE_OUVERTURE = "fa_atw_envoye";

// Ouverture du formulaire d'inscription : AddToWishlist, une seule fois par session.
export function trackOuvertureFormulaire() {
  try {
    if (sessionStorage.getItem(STORAGE_OUVERTURE)) return;
    sessionStorage.setItem(STORAGE_OUVERTURE, "1");
  } catch {
    // sessionStorage indisponible (navigation privée stricte) : on garde au moins une seule fois par page.
    if ((window as unknown as { __faAtw?: boolean }).__faAtw) return;
    (window as unknown as { __faAtw?: boolean }).__faAtw = true;
  }
  quandFbqPret(() => window.fbq!("track", "AddToWishlist"));
}
