"use client";

import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  SupportServiceTypeIcons,
  SupportServiceTypeLabels,
} from "@/constants/assistant";
import { SupportServiceEntry } from "@/types/assistant";
import { useState } from "react";
import SupportServiceDetails from "./SupportServiceDetails";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SupportServicesList = ({
  services,
}: {
  services: SupportServiceEntry[];
}) => {
  const [showAll, setShowAll] = useState(false);
  const MAX_DISPLAY = 5;
  return (
    <>
      <h3 className="font-bold mb-3">Unterstützungsangebote</h3>
      <div className="flex flex-col gap-3">
        {services.length > 0 ? (
          services.map((service, index) => {
            if (!showAll && index >= MAX_DISPLAY) return null;
            return (
              <div key={`offering_${index}`}>
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="flex flex-row gap-4 cursor-pointer text-tc-contrast hover:bg-background hover:text-tc p-2 rounded-md">
                      <div className="align-top min-h-12 min-w-12">
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge className="text-center text-tc-contrast h-12 w-12 drop-shadow bg-highlight-50">
                                <i className="material-symbols-outlined">
                                  {SupportServiceTypeIcons.get(
                                    service.offer?.type || "OTHER"
                                  )}
                                </i>
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              {SupportServiceTypeLabels.get(
                                service.offer?.type || "OTHER"
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div>
                        <h4 className="font-semibold">{service.offer?.name}</h4>
                        <span>{service.provider?.name}</span>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent
                    className="max-w-[800px] max-h-screen bg-contrast-light overflow-y-scroll"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                  >
                    <SupportServiceDetails service={service} />
                  </DialogContent>
                </Dialog>
              </div>
            );
          })
        ) : (
          <span className="italic">Keine Angebote verfügbar</span>
        )}
      </div>
      {services.length > MAX_DISPLAY && (
        <Button
          variant={"link"}
          onClick={() => setShowAll((value) => !value)}
          className="m-0 p-0 inline-link text-base text-inherit"
        >
          {showAll ? "› Weniger anzeigen" : "› Alle anzeigen"}
        </Button>
      )}
    </>
  );
};

export default SupportServicesList;
