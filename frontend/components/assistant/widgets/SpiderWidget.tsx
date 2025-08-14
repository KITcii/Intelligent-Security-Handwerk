import { Suspense } from "react";
import DashboardWidgetWrapper from "./shared/DashboardWidgetWrapper";
import SpiderWidgetContent from "./SpiderWidgetContent";
import SuspenseWidgetLarge from "./shared/SuspenseWidgetLarge";

const SpiderWidget = () => {
  return (
    <DashboardWidgetWrapper
      className="h-auto min-w-fit"
      contentClassName="p-5 pb-1 w-full"
    >
      <div className="flex flex-col gap-3">
        <h2 className="font-bold">
          Ihre Standardabdeckung nach BSI Bausteinen
        </h2>
        <Suspense
          fallback={
            <div className="mt-6">
              <SuspenseWidgetLarge />
            </div>
          }
        >
          <SpiderWidgetContent />
        </Suspense>
      </div>
    </DashboardWidgetWrapper>
  );
};

export default SpiderWidget;
