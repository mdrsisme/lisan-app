export interface ColorConfig {
  primary: string;
  gradient: string;
  shadow: string;
  description: string;
}

export type ThemeColorName = 
  | "cosmic" 
  | "ocean" 
  | "solar" 
  | "midnight" 
  | "sunset" 
  | "aurora";

export const themeColors: Record<ThemeColorName, ColorConfig> = {
  cosmic: {
    primary: "text-[#6366f1]",
    gradient: "bg-gradient-to-tl from-[#fb7185] via-[#d946ef] to-[#6366f1]",
    shadow: "shadow-[0_20px_40px_-15px_rgba(217,70,239,0.4)]",
    description: "Rose • Fuchsia • Indigo"
  },
  ocean: {
    primary: "text-[#10b981]",
    gradient: "bg-gradient-to-tl from-[#3b82f6] via-[#06b6d4] to-[#10b981]",
    shadow: "shadow-[0_20px_40px_-15px_rgba(6,182,212,0.4)]",
    description: "Blue • Cyan • Emerald"
  },
  solar: {
    primary: "text-[#f59e0b]",
    gradient: "bg-gradient-to-tl from-[#ef4444] via-[#f97316] to-[#facc15]",
    shadow: "shadow-[0_20px_40px_-15px_rgba(249,115,22,0.4)]",
    description: "Red • Orange • Amber"
  },
  midnight: {
    primary: "text-[#2563eb]",
    gradient: "bg-gradient-to-tl from-[#f43f5e] via-[#8b5cf6] to-[#2563eb]",
    shadow: "shadow-[0_20px_40px_-15px_rgba(139,92,246,0.4)]",
    description: "Pink • Violet • Royal"
  },
  sunset: {
    primary: "text-[#7c3aed]",
    gradient: "bg-gradient-to-tl from-[#fbbf24] via-[#f43f5e] to-[#7c3aed]",
    shadow: "shadow-[0_20px_40px_-15px_rgba(244,63,94,0.4)]",
    description: "Gold • Rose • Violet"
  },
  aurora: {
    primary: "text-[#0d9488]",
    gradient: "bg-gradient-to-tl from-[#38bdf8] via-[#a3e635] to-[#0d9488]",
    shadow: "shadow-[0_20px_40px_-15px_rgba(163,230,53,0.3)]",
    description: "Sky • Lime • Teal"
  }
};