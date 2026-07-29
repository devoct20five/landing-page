"use client";

import WorkCategoryGrid from "@/components/works/WorkCategoryGrid";

const ITEMS = [
  {
    title: "Terraform – Brand Identity",
    duration: "12:41",
    thumbnail:
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    href: "#",
  },
  {
    title: "Momentum – Logo Design",
    duration: "09:16",
    thumbnail:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    href: "#",
  },
  {
    title: "Ventura – Brand System",
    duration: "14:28",
    thumbnail:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    href: "#",
  },
  {
    title: "Auric – Packaging Design",
    duration: "10:33",
    thumbnail:
      "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    href: "#",
  },
  {
    title: "Kinetic – Visual Language",
    duration: "08:52",
    thumbnail:
      "https://images.unsplash.com/photo-1626785774625-0b1c2c4eab67?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    href: "#",
  },
  {
    title: "Nest – UI/UX Design",
    duration: "11:07",
    thumbnail:
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    href: "#",
  },
];

export default function DesignWorkPage() {
  return <WorkCategoryGrid category="Design" items={ITEMS} />;
}
