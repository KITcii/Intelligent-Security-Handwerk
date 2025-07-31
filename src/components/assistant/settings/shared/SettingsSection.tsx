import { cn } from "@/lib/utils";
import BackgroundPanel from "@/components/assistant/shared/BackgroundPanel";
import { Suspense } from "react";
import SuspenseLoader from "@/components/shared/SuspenseLoader";

const SettingsSection = ({
  children,
  title,
  description,
  className,
}: {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "xl:grid xl:grid-cols-12 items-stretch bg-contrast-verylight px-4 sm:px-10 py-10 max-xl:space-y-6 ",
        className
      )}
    >
      <div className="col-span-3 pt-9 pe-8 max-xl:ms-2">
        {title && <h2 className="font-semibold hyphens-auto">{title}</h2>}
        {description && <p className="text-tc-muted">{description}</p>}
      </div>
      <div className="col-span-8 col-start-5 content-center">
        <BackgroundPanel className="h-full" contentClassName="h-full">
          <Suspense fallback={<SuspenseLoader />}>{children}</Suspense>
        </BackgroundPanel>
      </div>
    </div>
  );
};

export default SettingsSection;
