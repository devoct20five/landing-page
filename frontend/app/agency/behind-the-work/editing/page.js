"use client";

import WorkCategoryGrid from "@/components/works/WorkCategoryGrid";

const ITEMS = [
  {
    title: "Chase The Light",
    duration: "18:24",
    thumbnail:
      "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    href: "#",
  },
  {
    title: "Unseen Hustle",
    duration: "12:37",
    thumbnail:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    href: "#",
  },
  {
    title: "Made To Perform",
    duration: "15:02",
    thumbnail:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    href: "#",
  },
  {
    title: "Next Round",
    duration: "09:11",
    thumbnail:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    href: "#",
  },
  {
    title: "Time In Motion",
    duration: "14:48",
    thumbnail:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    href: "#",
  },
  {
    title: "Find Your Escape",
    duration: "10:22",
    thumbnail:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    href: "#",
  },
];

export default function EditingWorkPage() {
  return <WorkCategoryGrid category="Editing" items={ITEMS} />;
}
