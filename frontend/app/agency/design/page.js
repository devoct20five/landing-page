import ServicePageTemplate from "@/components/sections/ServicePageTemplate";
import { SERVICES } from "@/data/content";
import { fetchService } from "@/lib/catalog";
import { adaptService } from "@/data/plans";

export const revalidate = 30;

export const metadata = {
  title: "Design — OCT20FIVE",
  description: "Imagine. Design. Define. Identity, packaging, campaigns.",
};

export default async function Page() {
  const pricing = adaptService(await fetchService("design"));
  return <ServicePageTemplate data={SERVICES.design} pricing={pricing} />;
}
