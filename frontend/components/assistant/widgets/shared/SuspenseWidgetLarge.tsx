import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const SuspenseWidgetLarge = ({ className }: { className?: string }) => {
  return (
    <div className="flex justify-center gap-8 w-full items-center max-w-[700px] h-32">
      <Skeleton
        className={cn("h-[90%] aspect-square rounded-full", className)}
      />
      <div className="space-y-2 grow justify-start content-start flex flex-col items-start">
        <Skeleton className={cn("h-4 w-[80%]", className)} />
        <Skeleton className={cn("h-4 w-[50%]", className)} />
        <Skeleton className={cn("h-4 w-[20%]", className)} />
        <Skeleton className={cn("h-4 w-[70%]", className)} />
      </div>
    </div>
  );
};

export default SuspenseWidgetLarge;
