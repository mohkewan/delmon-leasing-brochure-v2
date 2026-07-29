// ===== DELMON INVESTMENT — Shared Brochure Types =====
// Extracted from Home.tsx for reuse across templates and utilities

export type UnitType = "مكتب" | "معرض" | "محل تجاري" | "مستودع" | "وحدة سكنية" | "فندق" | "أخرى";

export interface Unit {
  id: string;
  unitNumber: string;
  floor: string;
  unitType: UnitType;
  area: string;
  monthlyRent?: string;
  pricePerMeter?: string;
  features: string;
  contractDuration?: string;
  description?: string;
}

export interface ProjectData {
  projectName: string;
  projectType: string;
  city: string;
  district: string;
  totalArea: string;
  floors: string;
  completionYear: string;
  description: string;
  amenities: string;
  projectImage?: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  units: Unit[];
}

export type BrochureTemplate = "classic" | "dark" | "magazine";

export interface BrochureTheme {
  id: BrochureTemplate;
  nameAr: string;
  nameEn: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  bgColor: string;
  textColor: string;
}

export const BROCHURE_THEMES: BrochureTheme[] = [
  {
    id: "classic",
    nameAr: "Classic",
    nameEn: "Classic",
    description: "الهوية الرسمية — فاتح ذهبي",
    primaryColor: "#949437",
    accentColor: "#8fa9dc",
    bgColor: "#FFFFFF",
    textColor: "#2d2d2d",
  },
  {
    id: "dark",
    nameAr: "Dark Luxury",
    nameEn: "Dark",
    description: "داكن فاخر — صورة كاملة",
    primaryColor: "#949437",
    accentColor: "#8fa9dc",
    bgColor: "#060e18",
    textColor: "#ffffff",
  },
  {
    id: "magazine",
    nameAr: "Bold Magazine",
    nameEn: "Magazine",
    description: "عصري مجلة — قطري تسويقي",
    primaryColor: "#949437",
    accentColor: "#8fa9dc",
    bgColor: "#f7f6f2",
    textColor: "#1a1a1a",
  },
];
