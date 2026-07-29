"use client";

import WorkCategoryGrid from "@/components/works/WorkCategoryGrid";

const ITEMS = [
  {
    title: "Nexora – Agency Website",
    duration: "12:31",
    thumbnail:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    href: "#",
  },
  {
    title: "Leafy – Ecommerce Website",
    duration: "14:08",
    thumbnail:
      "https://images.unsplash.com/photo-1463320726281-696a485928c7?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    href: "#",
  },
  {
    title: "Fokus – Portfolio Website",
    duration: "11:45",
    thumbnail:
      "https://images.unsplash.com/photo-1494783367193-149034c05e8f?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    href: "#",
  },
  {
    title: "FitTrack – SaaS Website",
    duration: "13:27",
    thumbnail:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    href: "#",
  },
  {
    title: "Horizon – Travel Website",
    duration: "10:19",
    thumbnail:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    href: "#",
  },
  {
    title: "Velox – SaaS Landing Page",
    duration: "09:44",
    thumbnail:
      "https://images.unsplash.com/photo-1550439062-609e1531270e?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    href: "#",
  },
];

export default function WebDevWorkPage() {
  return <WorkCategoryGrid category="Web-Dev" items={ITEMS} />;
}
