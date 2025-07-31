import { Suspense } from "react";
import ContactWidgetContent from "./ContactWidgetContent";
import DashboardWidgetWrapper from "./shared/DashboardWidgetWrapper";
import SuspenseWidgetSimpleText from "./shared/SuspenseWidgetSimpleText";

const ContactWidget = () => {
  return (
    <DashboardWidgetWrapper
      className="h-auto min-w-64 xl:max-w-72 grow"
      contentClassName="p-5 pb-8"
    >
      <div className="flex flex-col gap-5">
        <h2 className="font-bold">Im Notfall</h2>
        <Suspense
          fallback={
            <div className="mt-6">
              <SuspenseWidgetSimpleText blocks={3} />
            </div>
          }
        >
          <ContactWidgetContent />
        </Suspense>
      </div>
    </DashboardWidgetWrapper>
  );
};

export default ContactWidget;
