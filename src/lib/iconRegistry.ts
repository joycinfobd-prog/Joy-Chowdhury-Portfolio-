import {
  Award,
  BadgeCheck,
  Bot,
  Brain,
  Briefcase,
  Building2,
  Calculator,
  Camera,
  Globe,
  GraduationCap,
  HeartHandshake,
  Languages,
  Leaf,
  Lightbulb,
  Megaphone,
  Monitor,
  Rocket,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/** Every icon the admin panel can assign, addressed by a stable string name. */
export const ICONS: Record<string, LucideIcon> = {
  Award,
  BadgeCheck,
  Bot,
  Brain,
  Briefcase,
  Building2,
  Calculator,
  Camera,
  Globe,
  GraduationCap,
  HeartHandshake,
  Languages,
  Leaf,
  Lightbulb,
  Megaphone,
  Monitor,
  Rocket,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Wrench,
};

export const ICON_NAMES = Object.keys(ICONS);

/** Resolve an icon name to a component, with a safe fallback. */
export function getIcon(name: string | undefined): LucideIcon {
  return (name && ICONS[name]) || Sparkles;
}
