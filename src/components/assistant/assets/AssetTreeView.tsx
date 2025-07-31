import { Asset, AssetVariants } from "@/types/assistant";
import AssetTreeLayer from "./AssetTreeLayer";
import BackgroundPanel from "../shared/BackgroundPanel";
import LoadingContent from "./list/LoadingContent";
import { cn } from "@/lib/utils";

const AssetTreeView = ({
  assetTree,
  filteredAssets,
  variant,
  searchMode,
  loading,
}: {
  assetTree: Asset;
  filteredAssets?: Asset[];
  variant: AssetVariants;
  searchMode: boolean;
  loading: boolean;
}) => {
  if (
    (assetTree === undefined ||
      assetTree.children === undefined ||
      assetTree.children.length === 0) &&
    (filteredAssets === undefined || filteredAssets.length === 0)
  ) {
    return (
      <div>
        Keine{" "}
        {variant === "infrastructure" ? "IT-Komponenten" : "ITSM-Maßnahmen"}{" "}
        verfügbar
      </div>
    );
  }
  return (
    <BackgroundPanel contentClassName="lg:min-h-[400px]">
      {loading ? (
        <LoadingContent />
      ) : (
        <div className="h-full md:min-w-[500px] max-w-full w-fit max-md:w-full py-5">
          {searchMode && (
            <div className="mb-5">
              <b>{filteredAssets?.length || 0}</b> Ergebnisse gefunden
            </div>
          )}
          {filteredAssets !== undefined && filteredAssets.length > 0
            ? filteredAssets.map((asset, index) => {
                return (
                  <AssetTreeLayer
                    key={`asset-tree-filtered-layer-${asset.id}`}
                    asset={asset}
                    assetTree={assetTree}
                    layer={0}
                    variant={variant}
                    className={cn(index % 2 !== 0 && "bg-contrast-verylight")}
                  />
                );
              })
            : !searchMode &&
              assetTree &&
              assetTree.children &&
              assetTree.children.map((asset, index) => {
                return (
                  <AssetTreeLayer
                    key={`asset-tree-root-layer-${asset.id}`}
                    asset={asset}
                    assetTree={assetTree}
                    layer={0}
                    variant={variant}
                    className={cn(index % 2 !== 0 && "bg-contrast-verylight")}
                  />
                );
              })}
        </div>
      )}
    </BackgroundPanel>
  );
};

export default AssetTreeView;
