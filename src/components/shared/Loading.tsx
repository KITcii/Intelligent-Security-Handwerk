import { cn } from "@/lib/utils";
import ProgressBar from "@/components/shared/ProgressBar";

const Loading = ({ className }: { className?: string }) => {
  return (
    <div className={cn("grid justify-items-center w-full", className)}>
      <div>
        <ProgressBar
          progress={50}
          spinner={true}
          style="bold"
          className="w-8"
        />
      </div>
      <div className="text-nowrap text-sm">Wird geladen...</div>
    </div>
  );
};

export default Loading;
