import { Suspense } from "react";
import ITSMMeasuresWidgetContent from "./ITSMMeasuresWidgetContent";
import DashboardWidgetWrapper from "./shared/DashboardWidgetWrapper";
import SuspenseWidgetSmall from "./shared/SuspenseWidgetSmall";

const ITSMMeasuresWidget = () => {
  return (
    <DashboardWidgetWrapper
      className="h-32 min-w-64 grow"
      contentClassName="grid place-items-center w-full h-full"
    >
      <Suspense fallback={<SuspenseWidgetSmall />}>
        <ITSMMeasuresWidgetContent />
      </Suspense>
    </DashboardWidgetWrapper>
  );
};

export default ITSMMeasuresWidget;
