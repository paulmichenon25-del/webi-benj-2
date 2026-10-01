import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeMobile, validateLead } from "../lib/lead.ts";
import { buildIcs, getSoiree, googleCalendarUrl, isAllowedLiveUrl } from "../lib/event.ts";

test("normalise les mobiles français en E.164", () => {
  for (const raw of ["06 12 34 56 78", "6.12.34.56.78", "+33 6 12 34 56 78", "0033612345678", "07-81-23-45-67"]) {
    const n = normalizeMobile(raw, "FR");
    assert.ok(n, raw);
  }
  assert.equal(normalizeMobile("06 12 34 56 78", "FR")?.e164, "+33612345678");
  assert.equal(normalizeMobile("06 12 34 56 78", "FR")?.nationalNumber, "612345678");
});

test("refuse les fixes et les numéros invalides", () => {
  assert.equal(normalizeMobile("04 77 12 34 56", "FR"), null);
  assert.equal(normalizeMobile("12345", "FR"), null);
  assert.equal(normalizeMobile("", "FR"), null);
});

test("accepte un mobile belge et un numéro étranger saisi avec +", () => {
  assert.equal(normalizeMobile("0470 12 34 56", "BE")?.e164, "+32470123456");
  assert.equal(normalizeMobile("+32 470 12 34 56", "FR")?.e164, "+32470123456");
});

test("valide le formulaire", () => {
  const ok = { prenom: "Léa", email: "lea@exemple.fr", telephone: "0612345678", pays: "FR", segment: "boudoir", consentementRappels: false, tracking: {} };
  assert.deepEqual(validateLead(ok), {});
  assert.deepEqual(validateLead({ ...ok, segment: "" }), {}); // question facultative
  const ko = validateLead({ ...ok, prenom: " ", email: "lea@", telephone: "01", segment: "x" });
  assert.deepEqual(Object.keys(ko).sort(), ["email", "prenom", "segment", "telephone"]);
});

test("agenda : 20h heure de Paris = 18h UTC, les deux soirées", () => {
  const s1 = getSoiree("1")!;
  const s2 = getSoiree("2")!;
  assert.match(googleCalendarUrl(s1, ""), /dates=20261018T180000Z%2F20261018T200000Z/);
  assert.match(googleCalendarUrl(s2, ""), /dates=20261019T180000Z%2F20261019T200000Z/);
  const ics = buildIcs(s2, "https://event.webinarjam.com/live/abc", new Date("2026-10-01T10:00:00Z"));
  assert.match(ics, /DTSTART:20261019T180000Z/);
  assert.ok(ics.split("\r\n").every((l) => new TextEncoder().encode(l).length <= 75));
});

test("n'accepte que des liens de live WebinarJam", () => {
  assert.ok(isAllowedLiveUrl("https://event.webinarjam.com/go/live/123"));
  assert.ok(!isAllowedLiveUrl("https://evil.example.com/webinarjam.com"));
  assert.ok(!isAllowedLiveUrl("http://event.webinarjam.com/x"));
});
