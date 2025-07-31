import AssetListWrapper from "./AssetListWrapper";
import { Asset, AssetVariants } from "@/types/assistant";
import ErrorXL from "../shared/ErrorXL";
import { getAssetTree } from "@/lib/api/assets.api";
import ListToolbar from "./list/ListToolbar";

const AssetContent = async ({ variant }: { variant: AssetVariants }) => {
  let rootAsset: Asset | undefined = undefined;
  if (variant === "infrastructure" || variant === "measures") {
    rootAsset = await getAssetTree(variant);
  }

  if (rootAsset === undefined) {
    return (
      <ErrorXL cause="Datanabruf ist fehlgeschlagen!" className="min-h-96" />
    );
  }

  return (
    <div className="min-h-full flex flex-col gap-6">
      <ListToolbar variant={variant} assets={rootAsset.children} />
      <div className="flex-1 flex flex-col">
        <AssetListWrapper assetTree={rootAsset} variant={variant} />
      </div>
    </div>
  );
};

export default AssetContent;
