import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const SuspenseWidgetSimpleText = ({
  blocks = 1,
  lines = 3,
  className,
}: {
  blocks?: number;
  lines?: number;
  className?: string;
}) => {
  if (blocks < 1) {
    blocks = 1;
  }
  if (lines < 3) {
    lines = 3;
  }
  return (
    <div className="flex flex-col gap-8 w-full h-full max-w-72">
      {[...Array<never>(blocks)].map((_x, i) => (
        <div className="flex flex-col w-full space-y-2" key={i}>
          <Skeleton className={cn("h-4 w-[80%]", className)} />
          {[...Array<never>(lines - 2)].map((_x, j) => {
            const width = Math.floor(Math.random() * (3 - 1));
            switch (width) {
              case 0:
                return (
                  <Skeleton className={cn("h-4 w-[40%]", className)} key={j} />
                );
              case 1:
                return (
                  <Skeleton className={cn("h-4 w-[50%]", className)} key={j} />
                );
              case 2:
                return (
                  <Skeleton className={cn("h-4 w-[60%]", className)} key={j} />
                );

              case 3:
                return (
                  <Skeleton className={cn("h-4 w-[70%]", className)} key={j} />
                );

              default:
                return <></>;
            }
          })}
          <Skeleton className={cn("h-4 w-[90%]", className)} />
        </div>
      ))}
    </div>
  );
};

export default SuspenseWidgetSimpleText;
