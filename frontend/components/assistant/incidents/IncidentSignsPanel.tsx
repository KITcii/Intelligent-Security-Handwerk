import { cn } from "@/lib/utils";
import React from "react";
import IncidentPanel from "./IncidentPanel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import IncidentSignsKnowledgeWrapper from "./IncidentSignsKnowledgeWrapper";

type IncidentSign = {
  id: string;
  title: string;
  description: string;
  examples: string[];
};

const IncidentSignsPanel = ({ className }: { className?: string }) => {
  const incidentSigns: IncidentSign[] = [
    {
      id: "1",
      title: "Ungewöhnliches Systemverhalten",
      description:
        "Systeme oder Geräte verhalten sich anders als üblich, z. B. unerwartete Abstürze, hohe Prozessorlast oder unbekannte Programme.",
      examples: [
        "Ein PC wird extrem langsam, obwohl keine ressourcenintensiven Programme laufen.",
        "Plötzlich auftretende Pop-ups oder Warnmeldungen, die zuvor nicht da waren.",
        "Software, die ohne Nutzeraktion installiert wurde.",
      ],
    },
    {
      id: "2",
      title: "Ungewöhnliche E-Mail-Kommunikation",
      description:
        "E-Mails, die unerwartet oder verdächtig erscheinen, wie z. B. Phishing-Versuche, gefälschte Absenderadressen oder E-Mails mit schädlichen Anhängen.",
      examples: [
        "E-Mails von vermeintlichen Partnern, die ungewöhnliche Zahlungsanweisungen oder -forderungen enthalten.",
        "E-Mails mit Anhängen im .zip- oder .exe-Format, die ohne Kontext gesendet werden.",
        "Aufforderungen, Zugangsdaten einzugeben, die auf externe Websites führen.",
      ],
    },
    {
      id: "3",
      title: "Ungewöhnliche Telefonanrufe",
      description:
        "Telefonanrufe von unbekannten Personen, die versuchen, sensible Informationen zu erhalten oder Druck ausüben, um Handlungen wie Zahlungen durchzuführen.",
      examples: [
        "Anrufe von angeblichen IT-Support-Diensten, die Zugang zu Systemen fordern.",
        "Drohanrufe, die Zahlungen oder Informationen verlangen.",
        "Rückrufaufforderungen an verdächtige Telefonnummern.",
      ],
    },
    {
      id: "4",
      title: "Antivirus- und Sicherheitswarnungen",
      description:
        "Warnmeldungen von Sicherheitssoftware, die auf Bedrohungen hinweisen, wie Malware, Ransomware oder verdächtige Aktivitäten.",
      examples: [
        "Die Sicherheitssoftware meldet wiederholt das gleiche infizierte Programm.",
        "Ein plötzlicher Ausfall oder die Deaktivierung von Antivirensoftware.",
        "Hinweise auf blockierte Verbindungen zu Command-and-Control-Servern.",
      ],
    },
    {
      id: "5",
      title: "Unerwartete Benutzerkontenaktivitäten",
      description:
        "Aktivitäten, die nicht zu den üblichen Benutzergewohnheiten passen, wie z. B. Anmeldungen außerhalb der normalen Arbeitszeiten oder von ungewöhnlichen Orten.",
      examples: [
        "Ein Benutzerkonto meldet sich um 3 Uhr morgens an, obwohl der Mitarbeiter nur tagsüber arbeitet.",
        "Anmeldungen von unbekannten IP-Adressen oder Ländern, in denen das Unternehmen nicht tätig ist.",
        "Zugriffe auf Dateien oder Systeme, auf die der Benutzer normalerweise keinen Zugriff benötigt.",
      ],
    },
    {
      id: "6",
      title: "Mitarbeitermeldungen",
      description:
        "Mitarbeiter berichten von verdächtigen Beobachtungen oder ungewöhnlichen Aktivitäten in IT-Systemen.",
      examples: [
        "Ein Mitarbeiter meldet, dass seine Passwörter plötzlich nicht mehr funktionieren.",
        "Ein Benutzer berichtet, dass er Dateien nicht mehr öffnen kann, die er vorher regelmäßig verwendet hat.",
        "Verdächtige Änderungen an persönlichen oder geschäftlichen Konten, z. B. geänderte Bankverbindungen.",
      ],
    },
    {
      id: "7",
      title: "Ungewöhnliche Dateiänderungen",
      description:
        "Dateien oder Konfigurationen werden ohne legitimen Grund geändert oder gelöscht. Dies kann ein Hinweis auf Ransomware oder Malware sein.",
      examples: [
        "Plötzliche Verschlüsselung von Dateien mit ungewöhnlichen Dateiendungen (z. B. .crypt oder .locked).",
        "Änderungen an wichtigen Konfigurationsdateien, die zu Systemproblemen führen.",
        "Veränderte Prüf-Hashes (MD5, SHA256) bei Dateien, die eigentlich unverändert bleiben sollten.",
      ],
    },
    {
      id: "8",
      title: "Netzwerkanomalien",
      description:
        "Unerklärliche oder ungewöhnliche Aktivitäten im Netzwerkverkehr, wie Datenübertragungen zu unbekannten Servern oder unerwartete Verbindungsversuche.",
      examples: [
        "Ein stark erhöhtes Datenaufkommen zu unbekannten IP-Adressen, insbesondere ins Ausland.",
        "Netzwerkgeräte, die auf Ports kommunizieren, die normalerweise nicht genutzt werden.",
        "Unbekannte Geräte im lokalen Netzwerk.",
      ],
    },
  ];

  return (
    <IncidentPanel
      className={cn(className)}
      title="Woran erkenne ich einen IT-Sicherheitsvorfall?"
    >
      <div className="space-y-4">
        <p>
          Wenn Sie eines dieser Anzeichen bemerken, sollten Sie sofort handeln!
        </p>
        <Accordion type="single" collapsible>
          {incidentSigns &&
            incidentSigns.length > 0 &&
            incidentSigns.map((sign) => {
              return (
                <AccordionItem
                  key={sign.id}
                  value={sign.id}
                  className="border-0 mb-2"
                >
                  <AccordionTrigger className="text-base text-left font-semibold bg-contrast-light p-4 data-[state=open]:bg-highlight-50 data-[state=open]:text-tc-contrast">
                    {sign.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-base bg-background p-4 border-s-4 border-contrast-light">
                    <p className="mb-4">{sign.description}</p>
                    <h4 className="font-semibold">Beispiele:</h4>
                    <ul className="list-inside ms-6">
                      {sign.examples.map((example, index) => (
                        <li key={index} className="list-disc">
                          {example}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
        </Accordion>
      </div>
      <Separator className="my-6" />
      <IncidentSignsKnowledgeWrapper />
    </IncidentPanel>
  );
};

export default IncidentSignsPanel;
