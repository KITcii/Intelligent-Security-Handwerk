import React from "react";
import BackgroundPanel from "../../shared/BackgroundPanel";
import ProgressBar from "@/components/shared/ProgressBar";
import { RecommendationStatistic } from "@/types/assistant";

const StatisticPanel = ({
  data,
}: {
  data: RecommendationStatistic | undefined;
}) => {
  if (data === undefined) {
    return <></>;
  }

  if (data.percent > 1 || data.percent < 0) {
    return <></>;
  }

  const percent = Math.round((data.percent + Number.EPSILON) * 1000) / 10;

  return (
    <BackgroundPanel
      title="Umsetzungsstatistik"
      className="h-full"
      contentClassName="h-full"
    >
      <div className="flex flex-col gap-5 mt-8 h-full">
        <div className="flex w-full justify-center">
          <div className="justify-items-center flex items-center">
            <ProgressBar className="w-[160px]" progress={percent} />
          </div>
        </div>
        <div>
          <p className="hyphens-auto">
            Aus Ihrer Region haben bereits {percent}% aller Betriebe{" "}
            {data?.profession &&
              `in der
            Branche ${data.profession.name}`}{" "}
            mit ähnlicher Mitarbeiteranzahl diese Handlungsempfehlung umgesetzt
          </p>
        </div>
      </div>
    </BackgroundPanel>
  );
};

export default StatisticPanel;
