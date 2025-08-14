"use client";

import { Asset, AssetVariants } from "@/types/assistant";
import AssetTileListWrapper from "./AssetTileListWrapper";
import AssetBreadcrump from "./AssetBreadcrump";
import LoadingContent from "./list/LoadingContent";

const AssetTileView = ({
  assetTree,
  filteredAssets,
  variant,
  path,
  searchMode,
  loading,
}: {
  assetTree: Asset | undefined;
  filteredAssets?: Asset[];
  variant: AssetVariants;
  path: Asset[] | undefined;
  searchMode: boolean;
  loading: boolean;
}) => {
  return (
    <div className="ps-6 mb-10">
      {loading ? (
        <LoadingContent />
      ) : (
        <>
          {searchMode ? (
            <div>
              <b>{filteredAssets?.length || 0}</b> Ergebnisse gefunden
            </div>
          ) : (
            <AssetBreadcrump
              trace={path}
              staticLabel={
                searchMode && !loading ? "Suchergebnisse" : undefined
              }
            />
          )}
          <AssetTileListWrapper
            rootAsset={assetTree}
            filteredAssets={filteredAssets}
            searchMode={searchMode}
            variant={variant}
          />
        </>
      )}
    </div>
  );
};

export default AssetTileView;
