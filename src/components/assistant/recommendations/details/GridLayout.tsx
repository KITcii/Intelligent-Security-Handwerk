import FeedbackPanel from "./FeedbackPanel";
import QuickFeedbackPanel from "./QuickFeedbackPanel";
import RecommendationPanel from "./RecommendationPanel";
import StatisticPanel from "./StatisticPanel";
import ThreatLevelPanel from "./ThreatLevelPanel";
import SupportPanel from "./SupportPanel";
import { Asset, BackendRecommendation } from "@/types/assistant";

const GridLayout = ({
  data,
  asset,
}: {
  data: BackendRecommendation;
  asset: Asset;
}) => {
  return (
    <div className="flex flex-row gap-4 w-full h-full ">
      <div className="flex-1 h-full flex flex-col gap-4 ">
        <div>
          <RecommendationPanel data={data} asset={asset} />
        </div>
        <div>
          <QuickFeedbackPanel
            recommendationId={data.recommendation.controlID}
          />
        </div>
        <div className="xl:hidden flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
            <ThreatLevelPanel data={data} />
          </div>
          <div className="w-full sm:w-1/2">
            <StatisticPanel data={data.statistic} />
          </div>
        </div>
        <div>
          <SupportPanel data={data} />
        </div>
        <div>
          <FeedbackPanel recommendationId={data.recommendation.controlID} />
        </div>
      </div>
      {/* Side panel */}
      <div className="max-xl:hidden w-64 h-full flex flex-col gap-4">
        <div>
          <ThreatLevelPanel data={data} />
        </div>
        {data.statistic && (
          <div>
            <StatisticPanel data={data.statistic} />
          </div>
        )}
      </div>
    </div>
  );
};

export default GridLayout;
