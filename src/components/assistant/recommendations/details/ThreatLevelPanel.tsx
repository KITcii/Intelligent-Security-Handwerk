import React from "react";
import BackgroundPanel from "../../shared/BackgroundPanel";
import ThreatIndicator from "../ThreatIndicator";
import { BackendRecommendation } from "@/types/assistant";
import ThreatList from "../ThreatList";

const ThreatLevelPanel = ({ data }: { data: BackendRecommendation }) => {
  return (
    <BackgroundPanel
      title="Bedrohungsmaß"
      className="h-full"
      contentClassName="h-full"
    >
      <div className="flex flex-col gap-5 mt-8">
        <div className="flex w-full justify-center mb-4">
          {data.recommendation.severity && (
            <ThreatIndicator level={data.recommendation.severity} />
          )}
        </div>
        <div className="flex justify-between flex-wrap gap-5">
          {data.recommendation.threats &&
            data.recommendation.threats.length > 0 && (
              <div>
                <p className="font-semibold">Direkte Bedrohungen:</p>
                <ThreatList threats={data.recommendation.threats} max={4} />
              </div>
            )}
        </div>
      </div>
    </BackgroundPanel>
  );
};

export default ThreatLevelPanel;
