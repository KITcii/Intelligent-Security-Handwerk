import { cn } from "@/lib/utils";
import AssetBadge from "./AssetBadge";

const AssetTreeCategoryIndicator = ({ counter }: { counter: number }) => {
  return (
    <AssetBadge
      className={cn(
        "me-5",
        counter > 0 ? "bg-highlight-50" : "bg-contrast-neutral"
      )}
    >
      <span className="font-semibold">{counter}</span>
    </AssetBadge>
  );
};

export default AssetTreeCategoryIndicator;
