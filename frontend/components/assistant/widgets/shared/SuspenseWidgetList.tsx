import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import React from "react";

const SuspenseWidgetList = ({ className }: { className?: string }) => {
  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-1">
        {[...Array<never>(10)].map((_x, i) => (
          <div className="flex flex-row gap-6 w-full" key={i}>
            <Skeleton className={cn("h-10 w-[10%]", className)} />
            <Skeleton className={cn("h-10 grow", className)} />
            <Skeleton className={cn("h-10 w-[10%] ", className)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuspenseWidgetList;
