import { cn } from "@/lib/utils";
import React from "react";
import IncidentPanel from "./IncidentPanel";
import Link from "next/link";

const ReportPanel = ({ className }: { className?: string }) => {
  return (
    <IncidentPanel
      className={cn(className)}
      title="Wie melde ich einen IT-Sicherheitsvorfall ohne Meldepflicht?"
    >
      <div className="flex flex-row gap-12">
        <div>
          <Link
            href="https://www.bsi.bund.de/DE/IT-Sicherheitsvorfall/Kritische-Infrastrukturen-und-meldepflichtige-Unternehmen/kritische-infrastrukturen-und-meldepflichtige-unternehmen.html?nn=133608&pos=2"
            target="_blank"
          >
            <i className="material-symbols-outlined md-3xl text-highlight-100 fillhover">
              problem
            </i>
          </Link>
        </div>
        <div>
          <p className="max-w-prose">
            Eine freiwillige Meldung eines IT-Sicherheitsvorfalls hilft,
            neuartige Bedrohungen und untypische Sicherheitsvorfälle frühzeitig
            zu erkennen, insbesondere bei Angriffen, neuen Schwachstellen oder
            Datenabflüssen. Damit leistet Ihr Betrieb einen wichtigen Beitrag
            zur allgemeinen IT-Sicherheit, auch wenn Ihr Betrieb keiner
            Meldepflicht unterliegt.{" "}
            <Link
              href="https://www.bsi.bund.de/DE/IT-Sicherheitsvorfall/Kritische-Infrastrukturen-und-meldepflichtige-Unternehmen/kritische-infrastrukturen-und-meldepflichtige-unternehmen.html?nn=133608&pos=2"
              className="external-link"
              target="_blank"
            >
              Weitere Informationen zur Meldepflicht finden Sie HIER.
            </Link>
          </p>
          <div className="flex flex-row align-middle items-center font-semibold mt-4">
            <i className="material-symbols-outlined md-s me-1">
              keyboard_double_arrow_right
            </i>
            <Link
              href="https://mip2.bsi.bund.de/de/meldungen/meldung-ohne-registrierung-erstellen/?meldestelle=10&formular=32"
              className="external-link"
              target="_blank"
            >
              Meldeformular des BSI
            </Link>
          </div>
        </div>
      </div>
    </IncidentPanel>
  );
};

export default ReportPanel;
