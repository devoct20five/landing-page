import ServicePageTemplate from "@/components/sections/ServicePageTemplate";
import { SERVICES } from "@/data/content";
import { fetchService } from "@/lib/catalog";
import { adaptService } from "@/data/plans";

export const revalidate = 30;

export const metadata = {
  title: "3D Ads — OCT20FIVE",
  description: "Model. Animate. Impact. Photoreal CGI and product films.",
};

export default async function Page() {
  const pricing = adaptService(await fetchService("3d-ads"));
  return <ServicePageTemplate data={SERVICES["3d-ads"]} pricing={pricing} />;
}
