import React from "react";
import AssetBaseTile from "@/components/assistant/assets/AssetBaseTile";
import AssetOptionsSheet from "@/components/assistant/assets/edit/AssetOptionsSheet";
import { Asset, AssetVariants } from "@/types/assistant";

const AssetTile = ({
  type,
  variant,
  asset,
  changeParent,
}: {
  type: "category" | "asset";
  variant: AssetVariants;
  asset: Asset;
  changeParent: (newParent: string) => void;
}) => {
  if (type === "category") {
    // component tile without options but redirect to subcategory page
    return (
      <div onClick={() => changeParent(asset.id)}>
        <AssetBaseTile asset={asset} variant={variant} />
      </div>
    );
  } else if (type === "asset") {
    // component tile with options
    return (
      <AssetOptionsSheet variant={variant} asset={asset}>
        <div>
          <AssetBaseTile asset={asset} variant={variant} />
        </div>
      </AssetOptionsSheet>
    );
  }
  return <></>;
};

export default AssetTile;
