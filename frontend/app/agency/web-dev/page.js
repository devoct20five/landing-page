import ServicePageTemplate from "@/components/sections/ServicePageTemplate";
import { SERVICES } from "@/data/content";
import { fetchService } from "@/lib/catalog";
import { adaptService } from "@/data/plans";

export const revalidate = 30;

export const metadata = {
  title: "Web Dev — OCT20FIVE",
  description:
    "Design. Develop. Deploy. Fast, animated, high-converting sites.",
};

export default async function Page() {
  const pricing = adaptService(await fetchService("web-dev"));
  return <ServicePageTemplate data={SERVICES["web-dev"]} pricing={pricing} />;
}
