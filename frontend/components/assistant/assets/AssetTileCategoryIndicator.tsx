import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import AssetBadge from "./AssetBadge";

const AssetTileCategoryIndicator = ({
  selectedSubAssets = 0,
  selected = false,
}: {
  selectedSubAssets: number;
  selected?: boolean;
}) => {
  return (
    <div
      className={cn(
        "h-28 aspect-square rounded-full border border-contrast-dark/10"
      )}
    >
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger>
            <div className="ms-6 mt-5">
              {selected ? (
                <AssetBadge className="bg-highlight-50">
                  <span className="font-semibold">{selectedSubAssets}</span>
                </AssetBadge>
              ) : (
                <AssetBadge className="bg-contrast-semidark/30">
                  <span className="font-semibold">0</span>
                </AssetBadge>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <span className="text-base">
              <span>
                <b>Komponentengruppe</b>
                <br />
                Erfasste Subkomponenten: <b>{selectedSubAssets}</b>
              </span>
            </span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default AssetTileCategoryIndicator;
