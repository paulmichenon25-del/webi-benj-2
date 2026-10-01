import { Landing } from "@/components/Landing";
import { VARIANTES, variantesActives } from "@/content/variantes";

// « / » est réparti entre les variantes par proxy.ts. Cette page ne sert que si le
// proxy ne tourne pas : elle affiche alors la première variante active.
export default function Page() {
  return <Landing variante={VARIANTES[variantesActives()[0]]} />;
}
