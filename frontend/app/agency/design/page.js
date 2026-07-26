import ServicePageTemplate from "@/components/sections/ServicePageTemplate";
import { SERVICES } from "@/data/content";

export const metadata = {
  title: "Design — OCT20FIVE",
  description: "Imagine. Design. Define. Identity, packaging, campaigns.",
};

export default function Page() {
  return <ServicePageTemplate data={SERVICES.design} />;
}
