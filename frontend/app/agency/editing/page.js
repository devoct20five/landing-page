import ServicePageTemplate from "@/components/sections/ServicePageTemplate";
import { SERVICES } from "@/data/content";

export const metadata = {
  title: "Editing — OCT20FIVE",
  description:
    "Cut. Pace. Grip. Editing that keeps eyeballs where they belong.",
};

export default function Page() {
  return <ServicePageTemplate data={SERVICES.editing} />;
}
