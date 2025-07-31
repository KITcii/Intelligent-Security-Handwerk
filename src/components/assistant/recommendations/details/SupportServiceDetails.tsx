import { SupportServiceEntry } from "@/types/assistant";
import style from "./SupportServiceDetails.module.css";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";
import {
  SupportServiceTypeIcons,
  SupportServiceTypeLabels,
} from "@/constants/assistant";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SupportServiceDetails = ({
  service,
}: {
  service: SupportServiceEntry;
}) => {
  return (
    <div className="flex flex-col max-w-full ">
      <div className="flex flex-col gap-4">
        <DialogHeader>
          <div className="flex flex-row align-middle items-center gap-2 mb-[-0.5rem] text-highlight-50 font-semibold">
            <i className="material-symbols-outlined md-l">
              {SupportServiceTypeIcons.get(service.offer?.type || "OTHER")}
            </i>
            <span>
              {SupportServiceTypeLabels.get(service.offer?.type || "OTHER")}
            </span>
          </div>

          <DialogTitle className="font-bold text-xl">
            {service.offer?.name}
          </DialogTitle>
        </DialogHeader>
        <div className={cn(style.SubSection)}>
          <DialogDescription></DialogDescription>
          <p className="whitespace-pre-wrap">{service.offer?.description}</p>
        </div>
        {service.offer?.topics && service.offer?.topics.length > 0 && (
          <div className={cn(style.SubSection)}>
            <h3 className={cn(style.SubHeading)}>Schwerpunkte des Angebotes</h3>
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              {service.offer?.topics.map((topic, index) => {
                return (
                  <React.Fragment key={`service_topic_${service.id}_${index}`}>
                    {topic.description && topic.description?.length > 0 ? (
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              variant="secondary"
                              className={cn(style.TopicBadge)}
                            >
                              {topic.name}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-64">
                            <p>{topic.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge
                        variant="secondary"
                        className={cn(style.TopicBadge)}
                      >
                        {topic.name}
                      </Badge>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
        {service.website && (
          <div className={cn(style.SubSection)}>
            <h3 className={cn(style.SubHeading)}>
              Weitere Informationen, Terminvereinbarung, Buchung usw.
            </h3>
            <Link href={service.website} target="_blank">
              <Badge
                variant="secondary"
                className="button-success text-tc-contrast"
              >
                Direktlink des Anbieters{" "}
                <i className="material-symbols-outlined md-xs ms-2">
                  open_in_new
                </i>
              </Badge>
            </Link>
          </div>
        )}
        <div className={cn(style.SubSection)}>
          <h3 className={cn(style.SubHeading)}>Über den Anbieter</h3>
          <div className="grid grid-cols-6 max-sm:grid-cols-1 gap-2">
            <div className={cn(style.OrgListLabel)}>
              <div className="flex flex-row items-center">
                <i className="material-symbols-outlined md-s me-2">
                  corporate_fare
                </i>
                <span>Anbieter</span>
              </div>
            </div>
            <div className={cn(style.OrgListValue)}>
              <div className="font-semibold mb-2">{service.provider?.name}</div>
              <div>{service.provider?.description}</div>
            </div>
            <div className={cn(style.OrgListLabel)}>
              <div className="flex flex-row items-center">
                <i className="material-symbols-outlined md-s me-2">person</i>
                <span>Kontaktperson</span>
              </div>
            </div>
            <div className={cn(style.OrgListValue)}>
              {service.provider?.contactPerson}
            </div>
            {(service.provider?.street ||
              service.provider?.location?.postalCode ||
              service.provider?.location?.name ||
              service.provider?.addressDetails) && (
              <>
                <div className={cn(style.OrgListLabel)}>
                  <div className="flex flex-row items-center">
                    <i className="material-symbols-outlined md-s me-2">home</i>
                    <span>Adresse</span>
                  </div>
                </div>
                <div className={cn(style.OrgListValue)}>
                  {service.provider?.street && (
                    <div>
                      <div>
                        {service.provider?.street}{" "}
                        {service.provider?.streetNumber &&
                          service.provider?.streetNumber}
                      </div>
                      <div>
                        {service.provider?.location?.postalCode}{" "}
                        {service.provider?.location?.name}
                      </div>
                      <div>{service.provider?.addressDetails}</div>
                    </div>
                  )}
                </div>
              </>
            )}
            {service.provider?.mail && (
              <>
                <div className={cn(style.OrgListLabel)}>
                  <div className="flex flex-row items-center">
                    <i className="material-symbols-outlined md-s me-2">mail</i>
                    <span>E-Mail</span>
                  </div>
                </div>
                <div className={cn(style.OrgListValue)}>
                  <Link
                    href={`mailto:${service.provider?.mail}`}
                    className="external-link"
                  >
                    {service.provider?.mail}
                  </Link>
                </div>
                <div className={cn(style.OrgListLabel)}>
                  <div className="flex flex-row items-center">
                    <i className="material-symbols-outlined md-s me-2">phone</i>
                    <span>Telefon</span>
                  </div>
                </div>
                <div className={cn(style.OrgListValue)}>
                  {service.provider?.phone}
                </div>
              </>
            )}
            {service.provider?.website && (
              <>
                <div className={cn(style.OrgListLabel)}>
                  <div className="flex flex-row items-center">
                    <i className="material-symbols-outlined md-s me-2">
                      language
                    </i>
                    <span>Website</span>
                  </div>
                </div>

                <div className={cn(style.OrgListValue)}>
                  <Link
                    target="_blank"
                    className="external-link"
                    href={service.provider?.website}
                  >
                    {service.provider?.website}
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportServiceDetails;
