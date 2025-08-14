import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const SuspenseWidgetSmall = ({ className }: { className?: string }) => {
  return (
    <div className="flex justify-center gap-4 w-full h-full items-center">
      <Skeleton
        className={cn("h-[90%] aspect-square rounded-full", className)}
      />
      <div className="space-y-2 grow justify-center content-center flex flex-col items-center">
        <Skeleton className={cn("h-4 w-[80%]", className)} />
        <Skeleton className={cn("h-4 w-[50%]", className)} />
        <Skeleton className={cn("h-4 w-[90%]", className)} />
      </div>
    </div>
  );
};

export default SuspenseWidgetSmall;
