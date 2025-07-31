import { AssetVariants, MeasureDisplayStatus } from "@/types/assistant";
import AssetBadge from "./AssetBadge";
import { VariantAssetIndicatorValues } from "@/constants/assistant";
import { cn } from "@/lib/utils";
import AssetLeafIndicatorTooltip from "./AssetLeafIndicatorTooltip";

const AssetTreeLeafIndicator = ({
  variant,
  selected = false,
  status,
}: {
  variant: AssetVariants;
  selected: boolean;
  status?: MeasureDisplayStatus;
}) => {
  if (!selected) {
    return <></>;
  }

  return (
    <AssetLeafIndicatorTooltip
      variant={variant}
      label={
        variant === "measures"
          ? VariantAssetIndicatorValues[status || "DEFAULT"].label
          : undefined
      }
    >
      <AssetBadge
        className={cn(
          "bg-highlight-100 me-5",
          variant === "measures" &&
            VariantAssetIndicatorValues[status || "DEFAULT"].color
        )}
      >
        <>
          {variant === "infrastructure" ? (
            <i className="material-symbols-outlined bold">check</i>
          ) : (
            variant === "measures" && (
              <i className="material-symbols-outlined bold">
                {VariantAssetIndicatorValues[status || "DEFAULT"].icon}
              </i>
            )
          )}
        </>
      </AssetBadge>
    </AssetLeafIndicatorTooltip>
  );
};

export default AssetTreeLeafIndicator;
