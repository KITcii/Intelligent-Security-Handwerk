import { cn } from "@/lib/utils";
import React from "react";
import IncidentPanel from "./IncidentPanel";
import Link from "next/link";

const LinkListPanel = ({ className }: { className?: string }) => {
  type IncidenLinkCategory = {
    id: string;
    title: string;
    links: {
      title: string;
      url: string;
    }[];
  };
  const links: IncidenLinkCategory[] = [
    {
      id: "1",
      title: "Externe Unterstützung",
      links: [
        {
          title: "Industrie- und Handelskammer",
          url: "https://www.ihk.de/daten-und-informationssicherheit",
        },
        {
          title: "[ZDH] IT-Sicherheitsbotschafter Ihrer Handwerkskammer",
          url: "https://cybersicherheit-handwerk.de/Sicherheitsbotschafter#:~:text=Bei%20den%20IT%2DSicherheitsbotschaftern%20handelt,deren%20Angebot%20in%20Anspruch%20nehmen.",
        },
        {
          title: "[ZDH] Fachberater IT-Sicherheit",
          url: "https://cybersicherheit-handwerk.de/cgi-bin/scgi?sid=1&se=1&kd=0&sp=deu&rid=179&bef=neueseite",
        },
        {
          title: "[ZDH] IT-Grundschutz-Praktiker",
          url: "https://cybersicherheit-handwerk.de/cgi-bin/scgi?sid=1&se=1&kd=0&sp=deu&rid=180&bef=neueseite",
        },
        {
          title:
            "[BSI] Liste zertifizierter IT-Sicherheitsdienstleister in den Geltungsbereichen IS-Revision und IS-Penetrationstests",
          url: "https://www.bsi.bund.de/DE/Themen/Unternehmen-und-Organisationen/Standards-und-Zertifizierung/Zertifizierung-und-Anerkennung/Anerkennung-von-Stellen-und-Zertifizierung-IT-Sicherheitsdienstleister/IS-Rev/is-rev_node.html",
        },
        {
          title: "[BSI] Liste der qualifizierten APT-Response-Dienstleister",
          url: "https://www.bsi.bund.de/SharedDocs/Downloads/DE/BSI/Cyber-Sicherheit/Themen/Dienstleister_APT-Response-Liste.pdf?__blob=publicationFile&v=34",
        },
        {
          title: "[BSI] Liste qualifizierter DDoS-Mitigation-Dienstleister",
          url: "https://www.bsi.bund.de/SharedDocs/Downloads/DE/BSI/Cyber-Sicherheit/Themen/Dienstleister-DDos-Mitigation-Liste.pdf?__blob=publicationFile&v=18",
        },
        {
          title:
            "[BSI] Liste IT-Sicherheitsdienstleister im Bereich Lauschabwehr",
          url: "https://www.bsi.bund.de/DE/Themen/Unternehmen-und-Organisationen/Standards-und-Zertifizierung/Zertifizierung-und-Anerkennung/Anerkennung-von-Stellen-und-Zertifizierung-IT-Sicherheitsdienstleister/Lauschabwehr-im-Bereich-der-Wirtschaft/Liste-IT-Sicherheitsdienstleister/liste-it-sicherheitsdienstleister_node.html",
        },
      ],
    },
    {
      id: "2",
      title: "Hilfe zur Selbsthilfe (BSI)",
      links: [
        {
          title: "TOP 12 Maßnahmen bei Cyber-Angriffen",
          url: "https://www.bsi.bund.de/DE/Themen/Unternehmen-und-Organisationen/Informationen-und-Empfehlungen/Empfehlungen-nach-Angriffszielen/Unternehmen-allgemein/IT-Notfallkarte/TOP-12-Massnahmen/top-12-massnahmen_node.html",
        },
        {
          title: "Maßnahmenkatalog zum Notfallmanagement - Fokus IT-Notfälle –",
          url: "https://www.bsi.bund.de/DE/Themen/Unternehmen-und-Organisationen/Informationen-und-Empfehlungen/Empfehlungen-nach-Angriffszielen/Unternehmen-allgemein/IT-Notfallkarte/Massnahmenkatalog/massnahmenkatalog_node.html",
        },
        {
          title:
            "Erste Hilfe bei einem schweren IT-Sicherheitsvorfall Version 1.1",
          url: "https://www.bsi.bund.de/SharedDocs/Downloads/DE/BSI/Cyber-Sicherheit/Themen/Ransomware_Erste-Hilfe-IT-Sicherheitsvorfall.html?nn=133632#download=1",
        },
      ],
    },
    {
      id: "3",
      title: "Sicherheitswarnungen und Schwachstellen",
      links: [
        {
          title: "[BSI] Cyber-Sicherheitswarnungen",
          url: "https://www.bsi.bund.de/SiteGlobals/Forms/Suche/BSI/Sicherheitswarnungen/Sicherheitswarnungen_Formular.html?nn=133020&cl2Categories_DocType=callforbids",
        },
        {
          title: "[CERT-Bund] Sicherheitswarnungen",
          url: "https://wid.cert-bund.de/portal/wid/kurzinformationen",
        },
      ],
    },
  ];

  if (links === undefined || links.length === 0) {
    return <></>;
  }

  return (
    <IncidentPanel
      className={cn(className)}
      title="Wo finde ich weitere Informationen?"
    >
      <div className="flex flex-wrap gap-8" id="links">
        {links.map((category) => {
          if (category.links.length === 0) {
            return <></>;
          }
          return (
            <div
              key={category.id}
              id={`link_${category.id}`}
              className="w-full lg:w-[45%] bg-contrast-verylight"
            >
              <h4 className="font-semibold w-full bg-highlight-50 text-tc-contrast p-4">
                {category.title}
              </h4>
              <div>
                <ul className="list-inside p-4 ms-8 space-y-3">
                  {category.links.map((link) => {
                    return (
                      <li key={link.url} className="list-disc leading-snug">
                        <Link
                          href={link.url}
                          className="external-link"
                          target="_blank"
                        >
                          {link.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-full text-right mt-4">
        Quelle:{" "}
        <Link
          href="https://www.bsi.bund.de/DE/IT-Sicherheitsvorfall/Unternehmen/Ich-habe-einen-IT-Sicherheitsvorfall-Checkliste-Organisatorisches/ich-habe-einen-it-sicherheitsvorfall-checkliste-organisatorisches_node.html"
          className="external-link"
        >
          BSI
        </Link>
      </div>
    </IncidentPanel>
  );
};

export default LinkListPanel;
