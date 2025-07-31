import { Card, CardContent } from "@/components/ui/card";
import { Asset, AssetVariants } from "@/types/assistant";
import { cn } from "@/lib/utils";
import {
  countChildren,
  countSelectedChildren,
  determineMeasureDisplayStatus,
} from "@/lib/assetUtils";
import HoverInfoButton from "../shared/HoverInfoButton";
import AssetTileCategoryIndicator from "./AssetTileCategoryIndicator";
import AssetTileLeafIndicator from "./AssetTileLeafIndicator";
import AssetStatusIndicatorBar from "./AssetStatusIndicatorBar";

const AssetBaseTile = ({
  asset,
  variant,
}: {
  asset: Asset;
  variant: AssetVariants;
}) => {
  const childCount = countChildren(asset);
  const selectedChildrenCount = countSelectedChildren(asset);

  return (
    <Card
      className={cn(
        "group bg-white shadow-lg border-2 border-contrast-dark/20 hover:bg-highlight-100 hover:text-tc-contrast cursor-pointer",
        selectedChildrenCount > 0 && childCount > 0
          ? "border-highlight-50"
          : asset.asset && asset.asset.status === "IRRELEVANT"
            ? "bg-contrast-neutral hover:bg-contrast-semidark text-tc-muted hover:border-highlight-50"
            : asset.asset &&
              "bg-highlight-50 border-highlight-100 text-tc-contrast hover:border-highlight-50"
      )}
    >
      <CardContent className={cn("w-56 h-48 p-0 overflow-clip")}>
        <div className="relative h-full w-full">
          <div className="flex flex-col p-3 gap-1 z-10 relative">
            <div className="flex flex-row items-start min-h-12">
              <div className="grow max-w-[147px] overflow-clip ">
                <p
                  className="break-words hyphens-auto text-start leading-snug font-semibold line-clamp-3"
                  lang="de"
                >
                  {asset.name}
                </p>
              </div>
              {asset.description && (
                <div className="ps-2 mt-[-3px]">
                  <HoverInfoButton
                    color="text-inherit"
                    text={asset.description}
                    title={asset.name}
                  />
                </div>
              )}
            </div>
            <p
              className={cn(
                "text-xs group-hover:text-tc-contrast text-start pe-2 line-clamp-6 break-words hyphens-auto",
                asset.asset ? "line-clamp-3" : "text-tc-muted"
              )}
            >
              {asset.description}
            </p>
          </div>

          {variant === "infrastructure" ? (
            <>
              {childCount > 0 ? (
                <div className="absolute bottom-[-38px] right-[-32px]">
                  <AssetTileCategoryIndicator
                    selectedSubAssets={selectedChildrenCount}
                    selected={selectedChildrenCount > 0}
                  />
                </div>
              ) : (
                <div className="absolute bottom-[-38px] right-[-32px]">
                  <AssetTileLeafIndicator
                    variant={variant}
                    selected={asset.asset !== undefined}
                  />
                </div>
              )}
            </>
          ) : (
            variant === "measures" && (
              <>
                {childCount > 0 ? (
                  <AssetStatusIndicatorBar asset={asset} variant="tile" />
                ) : (
                  <div className="absolute bottom-[-38px] right-[-32px]">
                    <AssetTileLeafIndicator
                      variant={variant}
                      selected={asset.asset !== undefined}
                      status={determineMeasureDisplayStatus(asset.asset)}
                    />
                  </div>
                )}
              </>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetBaseTile;
