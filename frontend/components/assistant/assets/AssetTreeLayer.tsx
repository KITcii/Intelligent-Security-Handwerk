import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Asset, AssetVariants } from "@/types/assistant";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import HoverInfoButton from "../shared/HoverInfoButton";
import {
  countSelectedChildren,
  determineMeasureDisplayStatus,
  findAssetById,
} from "@/lib/assetUtils";
import AssetOptionsSheet from "./edit/AssetOptionsSheet";
import AssetTreeLeafIndicator from "./AssetTreeLeafIndicator";
import AssetTreeCategoryIndicator from "./AssetTreeCategoryIndicator";
import AssetStatusIndicatorBar from "./AssetStatusIndicatorBar";

const AssetTreeLayer = ({
  asset,
  assetTree,
  variant,
  layer,
  className,
}: {
  asset: Asset;
  assetTree: Asset;
  variant: AssetVariants;
  layer: number;
  className?: string;
}) => {
  const notLeaf = asset.children && asset.children.length > 0;
  const selectedLeafs = notLeaf ? countSelectedChildren(asset) : 0;
  const layerShift = [
    "ps-[1.5rem]",
    "ps-[3rem]",
    "ps-[4.5rem]",
    "ps-[6rem]",
    "ps-[7.5rem]",
    "ps-[9rem]",
    "ps-[10.5rem]",
    "ps-[12rem]",
    "ps-[13.5rem]",
    "ps-[15rem]",
  ];
  if (notLeaf) {
    return (
      <Accordion type="single" collapsible>
        <AccordionItem value={`asset_layer_${asset.id}`} className="border-b-0">
          <AccordionTrigger
            className={cn(
              "group hover:bg-highlight-50/20 hover:no-underline flex flex-col py-0 [&_svg]:hidden",
              layerShift[layer],
              className
            )}
          >
            <Separator />
            <div className="flex flex-row w-full py-4">
              <div className="h-full flex align-middle items-center w-12">
                <i className="material-symbols-outlined group-data-[state=open]:rotate-90 transition-transform duration-200">
                  chevron_right
                </i>
              </div>
              <div className="w-full flex flex-col">
                <div className="w-full flex flex-row flex-between px-2">
                  <div className="flex flex-row gap-2 items-center align-middle">
                    <span
                      className={cn(
                        "text-base text-left group-data-[state=open]:font-bold overflow-hidden text-wrap hyphens-auto"
                      )}
                    >
                      {asset.name}
                    </span>
                    <HoverInfoButton
                      color="text-inherit"
                      text={asset.description}
                      title={asset.name}
                      className="max-sm:opacity-0"
                    />
                  </div>
                  {variant === "infrastructure" ? (
                    <AssetTreeCategoryIndicator counter={selectedLeafs} />
                  ) : (
                    variant === "measures" && (
                      <AssetStatusIndicatorBar asset={asset} variant="tree" />
                    )
                  )}
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            {asset.children?.map((asset: Asset | number, index) => {
              // workaraound for missing asset in assetTree
              if (typeof asset === "number") {
                const lookup = findAssetById(
                  assetTree.children,
                  asset.toString()
                );
                if (lookup) {
                  return (
                    <AssetTreeLayer
                      key={`asset-tree-layer-${lookup.id}`}
                      asset={lookup}
                      assetTree={assetTree}
                      layer={layer + 1}
                      variant={variant}
                      className={cn(index % 2 !== 0 && "bg-contrast-verylight")}
                    />
                  );
                } else {
                  return null;
                }
              } else {
                return (
                  <AssetTreeLayer
                    key={`asset-tree-layer-${asset.id}`}
                    asset={asset}
                    assetTree={assetTree}
                    layer={layer + 1}
                    variant={variant}
                    className={cn(index % 2 !== 0 && "bg-contrast-verylight")}
                  />
                );
              }
            })}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  return (
    <AssetOptionsSheet variant={variant} asset={asset}>
      <div
        className={cn(
          "group w-full hover:bg-highlight-50/20 cursor-pointer",
          layerShift[layer],
          className
        )}
      >
        <Separator />
        <div className={cn("w-full flex flex-between py-6 ps-[2.8rem]")}>
          <div className="flex-1 flex flex-between pe-10">
            <span className="font-medium text-base group-hover:font-bold">
              {asset.name}
            </span>
          </div>
          <AssetTreeLeafIndicator
            variant={variant}
            selected={asset.asset !== undefined}
            status={
              variant === "measures"
                ? determineMeasureDisplayStatus(asset.asset)
                : undefined
            }
          />
        </div>
      </div>
    </AssetOptionsSheet>
  );
};

export default AssetTreeLayer;
