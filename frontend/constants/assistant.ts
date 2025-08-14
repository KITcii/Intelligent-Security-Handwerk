import {
  RecommendationSeverity,
  RecommendationStatus,
  SupportServiceType,
  VariantAssetIndicator,
} from "@/types/assistant";

export const SettingsTabsNamesValues = ["user", "users", "company"];

export const RecommendationStatusValues = [
  "open",
  "done",
  "in_progress",
  "irrelevant",
] as const;

export const RecommendationsSeverityValues = [
  "CRITICAL",
  "HIGH",
  "MEDIUM",
  "LOW",
] as const;

export const RecommendationStatusLabels = new Map<RecommendationStatus, string>(
  [
    ["open", "Offen"],
    ["in_progress", "In Bearbeitung"],
    ["irrelevant", "Ausgeblendet"],
    ["done", "Umgesetzt"],
  ]
);

export const RecommendationSeverityLabels = new Map<
  RecommendationSeverity,
  string
>([
  ["CRITICAL", "Kritisch"],
  ["HIGH", "Hoch"],
  ["MEDIUM", "Mittel"],
  ["LOW", "Gering"],
]);

export const SupportServiceTypeValues = [
  "INFO",
  "TRAINING",
  "CONSULTATION",
  "OTHER",
] as const;

export const SupportServiceTypeLabels = new Map<SupportServiceType, string>([
  ["INFO", "Informationsveranstaltung"],
  ["TRAINING", "Schulung"],
  ["CONSULTATION", "Beratung"],
  ["OTHER", "Sonstiges"],
]);

export const SupportServiceTypeIcons = new Map<SupportServiceType, string>([
  ["INFO", "privacy_tip"],
  ["TRAINING", "school"],
  ["CONSULTATION", "communication"],
  ["OTHER", "support"],
]);

export const AssetVariantsValues = ["infrastructure", "measures"] as const;

export const AssetListViewsValues = ["tiles", "tree", "export"] as const;

export const AssetSortingOptionValues = ["asc", "desc"] as const;

export const AssetSortingFieldValues = ["date", "relevancy", "name"] as const;

export const AssetListStructureValues = ["flat", "tree"] as const;

export const STAR_ENUM = ["1", "2", "3", "4", "5"] as const;

export const MeasureStatusValues = [
  "OPEN",
  "IRRELEVANT",
  "IN_PROCESS",
  "IMPLEMENTED",
] as const;

export const MeasureStatusLabelValues = [
  { id: "OPEN", name: "Offen" },
  { id: "IN_PROCESS", name: "In Bearbeitung" },
  { id: "IMPLEMENTED", name: "Umgesetzt" },
  { id: "IRRELEVANT", name: "Ausgeblendet" },
] as const;

export const MeasureDisplayStatusValues = [
  "IN_PROCESS",
  "IMPLEMENTED",
  "IRRELEVANT",
  "RECOMMENDED",
  "DEFAULT",
];

export const VariantAssetIndicatorValues: VariantAssetIndicator = {
  IMPLEMENTED: {
    color: "bg-highlight-100",
    label: "Vollständig umgesetzte Maßnahme",
    icon: "check",
  },
  RECOMMENDED: {
    color: "bg-yellow-500",
    label: "Empfohlene Maßnahme",
    icon: "smart_toy",
  },
  IN_PROCESS: {
    color: "bg-contrast-dark",
    label: "Maßnahme ist in Bearbeitung",
    icon: "construction",
  },
  IRRELEVANT: {
    color: "bg-contrast-dark",
    label: "Ausgeblendete Maßnahme",
    icon: "visibility_off",
  },
  DEFAULT: {
    color: "bg-contrast-light",
    label: "",
    icon: "",
  },
} as const;

export const StandardCoverageGradeValues = [
  "VERY_GOOD",
  "GOOD",
  "SATISFACTORY",
  "SUFFICIENT",
  "INSUFFICIENT",
] as const;

export const StandardCoverageGradeThemes = {
  VERY_GOOD: {
    color: "bg-highlight-100",
    textColor: "text-highlight-100",
    label: "Sehr Gut",
  },
  GOOD: {
    color: "bg-highlight-100",
    textColor: "text-highlight-100",
    label: "Gut",
  },
  SATISFACTORY: {
    color: "bg-danger-low",
    textColor: "text-danger-low",
    label: "Befriedigend",
  },
  SUFFICIENT: {
    color: "bg-danger-low",
    textColor: "text-danger-low",
    label: "Ausreichend",
  },
  INSUFFICIENT: {
    color: "bg-danger-high",
    textColor: "text-danger-high",
    label: "Mangelhaft",
  },
  DEFAULT: {
    color: "bg-contrast-light",
    textColor: "text-contrast-light",
    label: "Unbekannt",
  },
};
