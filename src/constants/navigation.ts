export const footerLinksAssistant = [
  {
    label: "Kontakt",
    route: "/assistant/contact",
    external: false,
  },
  {
    label: "Impressum",
    route: "https://www.kit.edu/impressum.php",
    external: true,
  },
  {
    label: "Datenschutzerklärung",
    route: "/assistant/privacy",
    external: false,
  },
  {
    label: "Nutzungsbedingungen",
    route: "/assistant/terms",
    external: false,
  },
];

export const footerLinksAuth = [
  {
    label: "Projektbeschreibung",
    route: "https://intelligent-security-handwerk.de",
    external: true,
  },
  {
    label: "Kontakt",
    route: "/auth/contact",
    external: false,
  },
  {
    label: "Impressum",
    route: "https://www.kit.edu/impressum.php",
    external: true,
  },
  {
    label: "Datenschutzerklärung",
    route: "/auth/privacy",
    external: false,
  },
  {
    label: "Nutzungsbedingungen",
    route: "/auth/terms",
    external: false,
  },
];

export const navBarLinks = [
  {
    label: "Übersicht",
    icon: "grid_view",
    route: "/assistant/dashboard",
    spacer: true,
    recommendations: false,
  },
  {
    label: "IT-Infrastruktur",
    icon: "devices",
    route: "/assistant/infrastructure",
    spacer: false,
    recommendations: false,
  },
  {
    label: "ITSM-Maßnahmen",
    icon: "account_tree",
    route: "/assistant/measures",
    spacer: false,
    recommendations: false,
  },
  {
    label: "Empfehlungen",
    icon: "smart_toy",
    route: "/assistant/recommendations",
    spacer: true,
    recommendations: true,
  },
  {
    label: "Sicherheitsvorfälle",
    icon: "gpp_maybe",
    route: "/assistant/incidents",
    spacer: false,
    recommendations: false,
  },
  {
    label: "IT-Sicherheitswissen",
    icon: "developer_guide",
    route: "/assistant/glossary",
    spacer: false,
    recommendations: false,
  },
  {
    label: "Unterstützungsangebote",
    icon: "admin_panel_settings",
    route: "/assistant/services",
    spacer: true,
    recommendations: false,
  },
  {
    label: "Einstellungen",
    icon: "tune",
    route: "/assistant/settings",
    spacer: false,
    recommendations: false,
  },
];
