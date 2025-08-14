import { Suspense } from "react";
import DashboardWidgetWrapper from "./shared/DashboardWidgetWrapper";
import SuspenseWidgetSmall from "./shared/SuspenseWidgetSmall";
import ComponentsWidgetContent from "./ComponentsWidgetContent";

const ComponentsWidget = () => {
  return (
    <DashboardWidgetWrapper
      className="h-32 min-w-64 grow"
      contentClassName="grid place-items-center w-full h-full"
    >
      <Suspense fallback={<SuspenseWidgetSmall />}>
        <ComponentsWidgetContent />
      </Suspense>
    </DashboardWidgetWrapper>
  );
};

export default ComponentsWidget;
