"use client";

import WorkCategoryGrid from "@/components/works/WorkCategoryGrid";
const ITEMS = [
  {
    title: "Beyond Real – Camera Ad",
    duration: "13:42",
    thumbnail:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    href: "#",
  },
  {
    title: "Nexus – Fragrance Ad",
    duration: "15:18",
    thumbnail:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    href: "#",
  },
  {
    title: "Elevate – Shoe Ad",
    duration: "12:07",
    thumbnail:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    href: "#",
  },
  {
    title: "Volt – Energy Drink Ad",
    duration: "11:36",
    thumbnail:
      "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    href: "#",
  },
  {
    title: "Velocity – Automotive Ad",
    duration: "14:53",
    thumbnail:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    href: "#",
  },
  {
    title: "Pure Sound – Headphone Ad",
    duration: "10:28",
    thumbnail:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    href: "#",
  },
];

export default function ThreeDAdsWorkPage() {
  return <WorkCategoryGrid category="3D-Ads" items={ITEMS} />;
}
