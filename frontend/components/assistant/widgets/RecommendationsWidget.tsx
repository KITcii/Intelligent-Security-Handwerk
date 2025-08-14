import DashboardWidgetWrapper from "./shared/DashboardWidgetWrapper";
import RecommendationsWidgetContent from "./RecommendationsWidgetContent";
import { Suspense } from "react";
import SuspenseWidgetXSmall from "./shared/SuspenseWidgetXSmall";

const RecommendationsWidget = () => {
  return (
    <DashboardWidgetWrapper
      className="h-32 min-w-40 grow xl:max-w-56"
      href="/assistant/recommendations"
      bg="bg-highlight-100 hover:bg-highlight-50"
      contentClassName="grid place-items-center w-full h-full text-tc-contrast"
    >
      <Suspense fallback={<SuspenseWidgetXSmall className="bg-muted/30" />}>
        <RecommendationsWidgetContent />
      </Suspense>
    </DashboardWidgetWrapper>
  );
};

export default RecommendationsWidget;
