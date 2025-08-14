import { getEmergencyResourcesData } from "@/lib/api/resources.api";
import { cn, formatBusinessHours } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import IncidentPanel from "./IncidentPanel";

const EmergencyContactPanel = async ({ className }: { className?: string }) => {
  const data = await getEmergencyResourcesData();

  if (data === undefined) {
    return <></>;
  }

  return (
    <IncidentPanel className={cn(className)} title="Notfall-Hotlines">
      {data.contacts && (
        <div className="flex flex-wrap gap-4">
          {data.contacts.map((contact) => {
            return (
              <div
                className="flex flex-col w-[30ch] bg-contrast-verylight p-4"
                key={`emergency_contact_${contact.id}`}
              >
                <span className="font-bold ">{contact.name}</span>
                {contact.phone && (
                  <span className="text-highlight-100 font-bold">
                    {contact.phone}
                  </span>
                )}
                <span>
                  {contact.businessHours && (
                    <span>{formatBusinessHours(contact.businessHours)}</span>
                  )}
                </span>
                {contact.mail && (
                  <span>
                    <Link
                      href={`mailto:${contact.mail}`}
                      className="inline-link"
                    >
                      {contact.mail}
                    </Link>
                  </span>
                )}

                {contact.url && (
                  <span>
                    <Link
                      href={contact.url}
                      target="_blank"
                      className="external-link"
                    >
                      Webseite
                    </Link>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </IncidentPanel>
  );
};

export default EmergencyContactPanel;
