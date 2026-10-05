import {
  BadgeIndianRupee, Clock, Layers, Repeat, Sparkles, ShieldCheck, Film, Rocket,
  Palette, Gem, Boxes, Clapperboard, Atom, Code2, Sparkle,
} from 'lucide-react'

/** Icon names used in data/content.js → components (explicit imports keep the bundle small). */
export const ICONS = {
  BadgeIndianRupee, Clock, Layers, Repeat, Sparkles, ShieldCheck, Film, Rocket,
  Palette, Gem, Boxes, Clapperboard, Atom, Code2,
}
export const iconFor = (name) => ICONS[name] || Sparkle
