import { Asset, AssetInstance } from "@/types/assistant";
import React from "react";
import AliasList from "./AliasList";
import FetchingError from "../../shared/FetchingError";

const SheetContentComponent = ({
  fullAsset,
  asset,
  refreshData,
}: {
  fullAsset?: Asset;
  asset: Asset;
  refreshData: (instance: AssetInstance | undefined) => void;
}) => {
  return (
    <div>
      {fullAsset !== undefined ? (
        <>
          {asset.asset !== undefined && (
            <AliasList
              asset={asset}
              refresh={refreshData}
              active={asset.asset !== undefined}
            />
          )}
        </>
      ) : (
        <div className="mt-12">
          <FetchingError />
        </div>
      )}
    </div>
  );
};

export default SheetContentComponent;
