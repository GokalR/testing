import type { RegionSummary } from "./types";

export const COLOR = {
  navy900: "#193F72",
  navy700: "#2957A2",
  gold500: "#D7B56D",
  carbon: "#2B2A29",
  steel500: "#7688A1",
  surface: "#F1F2F7",
  border: "#D9DADA",
  borderMuted: "#B2B3B3",
  gray100: "#F1F2F7",
  gray600: "#898989",
  green600: "#059669",
  green50: "#ECFDF5",
  red600: "#DC2626",
  red50: "#FEF2F2",
  amber600: "#D97706",
  amber50: "#FFFBEB",
  blue50: "#EFF6FF",
} as const;

export const CHART_SEQUENCE = [
  COLOR.navy900,
  COLOR.gold500,
  COLOR.gold500,
  COLOR.navy700,
  COLOR.steel500,
] as const;

export const SAMPLE_REGIONS: RegionSummary[] = [
  { id: "buxoro",    name: "Бухоро",    population: "1,9M", unemployment: "3,4%" },
  { id: "toshkent",  name: "Тошкент",   population: "2,9M", unemployment: "2,1%" },
  { id: "samarqand", name: "Самарканд", population: "4,0M", unemployment: "4,2%" },
  { id: "fargona",   name: "Фарғона",   population: "3,8M", unemployment: "5,1%" },
  { id: "navoiy",    name: "Навоий",    population: "1,0M", unemployment: "2,8%" },
];
