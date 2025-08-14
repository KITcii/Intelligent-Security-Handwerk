import { Suspense } from "react";
import DashboardWidgetWrapper from "./shared/DashboardWidgetWrapper";
import WarningTickerWidgetContent from "./WarningTickerWidgetContent";
import SuspenseWidgetList from "./shared/SuspenseWidgetList";

const WarningTickerWidget = () => {
  return (
    <DashboardWidgetWrapper
      className="min-w-full xl:min-w-[700px]"
      contentClassName="p-5 pb-8 w-full overflow-hidden"
    >
      <div className="flex flex-col gap-5">
        <h2 className="font-bold">Aktuelle IT-Sicherheitswarnung</h2>
        <Suspense fallback={<SuspenseWidgetList />}>
          <WarningTickerWidgetContent />
        </Suspense>
      </div>
    </DashboardWidgetWrapper>
  );
};

export default WarningTickerWidget;
