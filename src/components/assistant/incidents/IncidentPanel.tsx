import { cn } from "@/lib/utils";
import React from "react";
import BackgroundPanel from "../shared/BackgroundPanel";

const IncidentPanel = ({
  title,
  className,
  children,
}: {
  title?: string;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={cn(className)}>
      <BackgroundPanel bg="bg-background">
        {title && <h2 className="text-xl font-semibold mb-8">{title}</h2>}
        <div>{children}</div>
      </BackgroundPanel>
    </div>
  );
};

export default IncidentPanel;
