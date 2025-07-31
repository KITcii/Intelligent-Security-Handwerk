import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const SuspenseWidgetXSmall = ({ className }: { className?: string }) => {
  return (
    <div className="flex flex-col gap-2 w-full h-full items-center justify-center max-w-40">
      <Skeleton className={cn("h-3 w-[50%]", className)} />
      <Skeleton className={cn("h-3 w-[80%]", className)} />
      <Skeleton className={cn("h-12 aspect-square rounded-full", className)} />
    </div>
  );
};

export default SuspenseWidgetXSmall;
