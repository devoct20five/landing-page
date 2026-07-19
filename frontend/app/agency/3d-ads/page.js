import ServicePageTemplate from "@/components/sections/ServicePageTemplate";
import { SERVICES } from "@/data/content";

export const metadata = {
  title: "3D Ads — OCT20FIVE",
  description: "Model. Animate. Impact. Photoreal CGI and product films.",
};

export default function Page() {
  return <ServicePageTemplate data={SERVICES["3d-ads"]} />;
}
