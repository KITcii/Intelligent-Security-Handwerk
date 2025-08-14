import { CompanySizeClass, OptionalCookiesOptions } from "@/types";

export const CompanySizeClassesValues = [
  "MICRO",
  "SMALL",
  "MEDIUM",
  "LARGE",
] as const;

export const CompanySizeClassValues: CompanySizeClass[] = [
  {
    id: "MICRO",
    name: "Kleinst­betrieb (bis zu 10 Mitarbeitende)",
  },
  {
    id: "SMALL",
    name: "Klein­betrieb (11 bis 50 Mitarbeitende)",
  },
  {
    id: "MEDIUM",
    name: "Mittel­betrieb (51 bis 250 Mitarbeitende)",
  },
  {
    id: "LARGE",
    name: "Groß­betrieb (mehr als 250 Mitarbeitende)",
  },
];

export const optionalCookiesValues = [
  // "ANALYTICS",
  "CONVINIENCE",
] as const;

export const optionalCookiesOptions: OptionalCookiesOptions = {
  // ANALYTICS: {
  //   label: "Statistik",
  //   description:
  //     "Optional setzt diese Website Statistik-Cookies, um zu verstehen, wie Sie mit unserer Website interagieren. Die Cookies sammeln Daten in einer Weise, die Sie nicht direkt identifizierbar macht, uns aber erlaubt unser Angebot durch statistische Auswertungen zu verbessern. Weitere Informationen zur Funktionsweise dieser Cookies finden Sie in unserer Datenschutzerklärung.",
  // },
  CONVINIENCE: {
    label: "Personalisierung",
    description:
      "Optional setzt diese Website Personalisierungs-Cookies zur Speicherung von Informationen, die das Verhalten oder das Aussehen der Website ändern, wie Ihre bevorzugte Sprache oder die Region, in der Sie sich befinden.",
  },
};
