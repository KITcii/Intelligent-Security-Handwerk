"use client";

import { Asset, AssetVariants } from "@/types/assistant";
import AssetTileList from "./AssetTileList";
import { useEffect, useState } from "react";

const AssetTileListWrapper = ({
  rootAsset,
  filteredAssets,
  searchMode,
  variant,
}: {
  rootAsset?: Asset;
  filteredAssets?: Asset[];
  searchMode: boolean;
  variant: AssetVariants;
}) => {
  const [parentAssets, setParentAssets] = useState<Asset[] | undefined>(
    rootAsset?.children
  );
  const [childlessAssets, setChildlessAssets] = useState<Asset[] | undefined>(
    undefined
  );

  useEffect(() => {
    if (filteredAssets) {
      setParentAssets(filteredAssets);
    } else {
      setParentAssets(rootAsset?.children);
    }
    setChildlessAssets(
      parentAssets?.filter(
        (asset) => asset.children === undefined || asset.children.length === 0
      )
    );
  }, [rootAsset, filteredAssets, parentAssets]);

  return (
    <div className="flex flex-col gap-10 mt-10">
      {parentAssets === undefined || parentAssets.length === 0 ? (
        <>
          {!searchMode ? (
            <div>
              Keine{" "}
              {variant === "infrastructure"
                ? "IT-Komponenten"
                : "ITSM-Maßnahmen"}{" "}
              verfügbar
            </div>
          ) : (
            <></>
          )}
        </>
      ) : searchMode ? (
        <AssetTileList assets={parentAssets} variant={variant} altTitle="" />
      ) : (
        <>
          {parentAssets.map((childAsset) => {
            if (
              childAsset.children !== undefined &&
              childAsset.children.length > 0
            ) {
              return (
                <AssetTileList
                  assets={childAsset.children}
                  parent={childAsset}
                  key={childAsset.id}
                  variant={variant}
                />
              );
            }
          })}
          {childlessAssets && childlessAssets.length > 0 && (
            <AssetTileList
              assets={childlessAssets}
              variant={variant}
              altTitle={
                parentAssets.length <= childlessAssets.length
                  ? undefined
                  : `Andere ${variant === "infrastructure" ? "Komponenten" : "Maßnahmen"}`
              }
            />
          )}
        </>
      )}
    </div>
  );
};

export default AssetTileListWrapper;
