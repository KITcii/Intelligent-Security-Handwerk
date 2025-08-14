import { Suspense } from "react";
import DashboardWidgetWrapper from "./shared/DashboardWidgetWrapper";
import SuspenseWidgetSimpleText from "./shared/SuspenseWidgetSimpleText";
import GlossaryWidgetContent from "./GlossaryWidgetContent";

const GlossaryWidget = () => {
  return (
    <DashboardWidgetWrapper
      className="h-auto min-w-72"
      contentClassName="p-5 pb-8"
    >
      <div className="flex flex-col gap-5">
        <h2 className="font-bold">Nützliches IT-Security Wissen</h2>
        <Suspense
          fallback={
            <div className="mt-6">
              <SuspenseWidgetSimpleText lines={7} />
            </div>
          }
        >
          <GlossaryWidgetContent />
        </Suspense>
      </div>
    </DashboardWidgetWrapper>
  );
};

export default GlossaryWidget;
