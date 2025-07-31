import { cn } from "@/lib/utils";
import React from "react";
import IncidentPanel from "./IncidentPanel";
import SingleStep from "./SingleStep";
import Link from "next/link";

const StepByStepPanel = ({ className }: { className?: string }) => {
  return (
    <IncidentPanel className={cn(className)} title="Was tun im Ernstfall?">
      <div className="space-y-8">
        <SingleStep pos={1} title="Bewahren Sie Ruhe!">
          Handeln Sie nicht übereilt und überlegen Sie sich in Ruhe, wie Sie
          vorgehen wollen.
        </SingleStep>
        <SingleStep pos={2} title="Keine Passwörter eingeben">
          Keinesfalls darf eine Anmeldung mit privilegierten Nutzerkonten
          (Administratorkonten) auf einem potenziell infizierten System
          erfolgen.
        </SingleStep>
        <SingleStep pos={3} title="Netzwerkkabel ziehen">
          Potenziell infizierte Systeme sollten umgehend von Ihrem Netzwerk
          getrennt werden, um ggf. eine weitere Ausbreitung von Schadsoftware
          auf andere Systeme zu verhindern. Dazu ziehen Sie das Netzwerkkabel
          und trennen bestehende WLAN-Verbindungen. Das System sollte nicht
          heruntergefahren oder ausgeschaltet werden.
        </SingleStep>
        <SingleStep pos={4} title="Beweise sichern">
          Versuchen Sie das Geschehen bestmöglich zu dokumentieren (z. B.
          Notizen, Bilder, Videos). Falls möglich, führen Sie eine Sicherung des
          Systems inkl. Speicherabbild für spätere Analysen durch.
        </SingleStep>
        <SingleStep pos={5} title="Passwörter ändern">
          Alle auf betroffenen Systemen gespeicherten bzw. nach der Infektion
          eingegebenen Zugangsdaten sollten als kompromittiert betrachtet und
          die Passwörter geändert werden.
        </SingleStep>
        <SingleStep pos={6} title="Externe Unterstützung holen">
          Holen Sie sich bei Bedarf frühzeitig externe Unterstützung.{" "}
          <Link
            href="https://www.bsi.bund.de/DE/Themen/Unternehmen-und-Organisationen/Informationen-und-Empfehlungen/Cyber-Sicherheitsnetzwerk/Qualifizierung/Digitaler_Ersthelfer/Suche-Ersthelfer/suche-ersthelfer-node.html"
            className="external-link"
            target="_blank"
          >
            Einen digitalen Ersthelfer über das BSI finden.
          </Link>{" "}
          Eine{" "}
          <Link href="#links" className="inline-link">
            Liste von möglichen Ansprechpartnern finden Sie HIER
          </Link>
          .
        </SingleStep>
        <SingleStep pos={7} title="Meldepflichten beachten">
          Falls Sie einer gesonderten Meldepflicht unterliegen (z. B. als Teil
          einer kritischen Infrastruktur), müssen Sie den Vorfall auf dem dafür
          vorgeschriebenen Weg melden.{" "}
          <Link
            href="https://www.bsi.bund.de/DE/IT-Sicherheitsvorfall/Kritische-Infrastrukturen-und-meldepflichtige-Unternehmen/kritische-infrastrukturen-und-meldepflichtige-unternehmen.html?nn=133608&pos=2"
            className="external-link"
            target="_blank"
          >
            Weitere Informationen finden Sie HIER.
          </Link>
        </SingleStep>
        <SingleStep pos={8} title="Systeme neu aufsetzen">
          Angegriffene Systeme sollten grundsätzlich als vollständig
          kompromittiert betrachtet werden. Sie sollten daher vor der erneuten
          Verwendung des Systems dieses komplett neu aufsetzen oder austauschen.
        </SingleStep>
      </div>
      <div className="w-full text-right mt-4">
        Quelle:{" "}
        <Link
          href="https://www.bsi.bund.de/SharedDocs/Downloads/DE/BSI/Cyber-Sicherheit/Themen/Ransomware_Erste-Hilfe-IT-Sicherheitsvorfall.pdf?__blob=publicationFile&v=3"
          className="external-link"
          target="_blank"
        >
          BSI
        </Link>
      </div>
    </IncidentPanel>
  );
};

export default StepByStepPanel;
