import { VariantAssetIndicatorValues } from "@/constants/assistant";
import { cn } from "@/lib/utils";
import { AssetVariants, MeasureDisplayStatus } from "@/types/assistant";
import AssetLeafIndicatorTooltip from "./AssetLeafIndicatorTooltip";

const AssetTileLeafIndicator = ({
  variant,
  selected = false,
  status,
}: {
  variant: AssetVariants;
  selected?: boolean;
  status?: MeasureDisplayStatus;
}) => {
  return (
    <div
      className={cn(
        "h-28 aspect-square rounded-full border border-contrast-dark/10",
        selected && "group-hover:bg-highlight-50 border-0",
        selected && variant === "infrastructure" && "bg-highlight-100",
        selected &&
          variant === "measures" &&
          VariantAssetIndicatorValues[status || "DEFAULT"].color
      )}
    >
      {selected ? (
        <div className="text-left">
          <AssetLeafIndicatorTooltip
            variant={variant}
            label={
              variant === "measures"
                ? VariantAssetIndicatorValues[status || "DEFAULT"].label
                : undefined
            }
          >
            {variant === "infrastructure" ? (
              <i
                className={cn(
                  "material-symbols-outlined text-tc-contrast md-xl ms-5 mt-4"
                )}
              >
                check
              </i>
            ) : (
              status && (
                <i className="material-symbols-outlined text-tc-contrast md-xl ms-5 mt-4">
                  {VariantAssetIndicatorValues[status].icon}
                </i>
              )
            )}
          </AssetLeafIndicatorTooltip>
        </div>
      ) : (
        <div className="text-left">
          <i
            className={cn(
              "material-symbols-outlined text-contrast-dark/10 md-1-5xl ms-4 mt-3",
              variant === "infrastructure" && "semithin"
            )}
          >
            {variant === "infrastructure" ? "computer" : "settings"}
          </i>
        </div>
      )}
    </div>
  );
};

export default AssetTileLeafIndicator;
