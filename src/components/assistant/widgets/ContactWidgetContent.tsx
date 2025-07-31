import {
  EmergencyResourceDocument,
  EmergencyResourceWebsite,
} from "@/types/assistant";
import { formatBusinessHours } from "@/lib/utils";
import Link from "next/link";
import { getEmergencyResourcesData } from "@/lib/api/resources.api";
import WidgetError from "./shared/WidgetError";

const ContactWidgetContent = async () => {
  const data = await getEmergencyResourcesData();

  if (data === undefined) {
    return <WidgetError />;
  }

  return (
    <div className="flex flex-wrap gap-x-20 gap-y-8">
      {data.contacts && (
        <div className="flex flex-col gap-3">
          {data.contacts.map((contact) => {
            return (
              <div
                className="flex flex-col"
                key={`emergency_contact_${contact.id}`}
              >
                <span className="font-bold">{contact.name}</span>
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

      {data.websites && (
        <div>
          {data.websites.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="font-bold">Hilfe zur Selbsthilfe</span>
              <ul className="list-outside relative left-4">
                {data.websites.map((website: EmergencyResourceWebsite) => {
                  return (
                    <li
                      className="list-disc"
                      key={`emergency_website_${website.id}`}
                    >
                      <Link
                        href={website.url}
                        target="_blank"
                        className="external-link"
                      >
                        {website.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
      {data.documents && (
        <div>
          {data.documents.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="font-bold">Wichtige Dokumente</span>
              <ul className="list-outside relative left-4">
                {data.documents.map((document: EmergencyResourceDocument) => {
                  return (
                    <li
                      className="list-disc"
                      key={`emergency_document_${document.id}`}
                    >
                      <Link
                        href={document.url}
                        target="_blank"
                        className="download-link"
                      >
                        {document.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContactWidgetContent;
