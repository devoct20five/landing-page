import ServicePageTemplate from "@/components/sections/ServicePageTemplate";
import { SERVICES } from "@/data/content";
import { fetchService } from "@/lib/catalog";
import { adaptService } from "@/data/plans";

export const revalidate = 30;

export const metadata = {
  title: "Editing — OCT20FIVE",
  description:
    "Cut. Pace. Grip. Editing that keeps eyeballs where they belong.",
};

export default async function Page() {
  const pricing = adaptService(await fetchService("editing"));
  return <ServicePageTemplate data={SERVICES.editing} pricing={pricing} />;
}
