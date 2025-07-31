import { Suspense } from "react";
import DashboardWidgetWrapper from "./shared/DashboardWidgetWrapper";
import SuspenseWidgetSmall from "./shared/SuspenseWidgetSmall";
import StandardCoverageWidgetContent from "./StandardCoverageWidgetContent";

const StandardCoverageWidget = () => {
  return (
    <DashboardWidgetWrapper
      className="h-32 min-w-72 grow"
      contentClassName="grid place-items-center w-full h-full"
    >
      <Suspense fallback={<SuspenseWidgetSmall />}>
        <StandardCoverageWidgetContent />
      </Suspense>
    </DashboardWidgetWrapper>
  );
};

export default StandardCoverageWidget;
