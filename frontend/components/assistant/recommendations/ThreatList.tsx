"use client";

import { Button } from "@/components/ui/button";
import { RecommendationThreat } from "@/types/assistant";
import { useState } from "react";

const ThreatList = ({
  threats,
  max = 5,
}: {
  threats: RecommendationThreat[] | undefined;
  max?: number;
}) => {
  const [showAll, setShowAll] = useState(false);

  if (threats === undefined || threats.length === 0) {
    return <></>;
  }

  return (
    <div className="text-base">
      <div className="hyphens-auto">
        <ul className="space-y-2">
          {threats.slice(0, showAll ? undefined : max).map((threat, index) => {
            return (
              <li
                key={`threat_list_${threat.id}_pos_${index}`}
                className="hyphens-auto leading-tight"
              >
                {threat.name}
              </li>
            );
          })}
        </ul>
      </div>
      {threats.length > max && (
        <Button
          variant={"link"}
          onClick={() => setShowAll((value) => !value)}
          className="m-0 p-0 inline-link text-base text-inherit"
        >
          {showAll ? "› Weniger anzeigen" : "› Alle anzeigen"}
        </Button>
      )}
    </div>
  );
};

export default ThreatList;
