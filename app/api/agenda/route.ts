import { NextResponse, type NextRequest } from "next/server";
import { SOIREES, buildIcs, defaultLiveUrl, getSoiree, isAllowedLiveUrl } from "@/lib/event";

// GET /api/agenda?soiree=1|2|tout&lien=<lien personnel WebinarJam>
// Renvoie un fichier .ics (Apple Calendar, Outlook…). Servi par le serveur et non
// généré dans le navigateur : c'est ce qui déclenche « Ajouter au calendrier » sur iPhone.
export function GET(req: NextRequest) {
  const param = req.nextUrl.searchParams.get("soiree") || "";
  const soiree = param === "tout" ? SOIREES : getSoiree(param);
  if (!soiree) return NextResponse.json({ error: "Soirée inconnue" }, { status: 404 });
  const lien = req.nextUrl.searchParams.get("lien") || "";
  const liveUrl = isAllowedLiveUrl(lien) ? lien : defaultLiveUrl();
  return new NextResponse(buildIcs(soiree, liveUrl), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="live-boudoir-${param === "tout" ? "2-soirees" : `soiree-${param}`}.ics"`,
      "Cache-Control": "no-store",
    },
  });
}
