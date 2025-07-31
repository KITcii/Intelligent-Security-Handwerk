import { collectChildrenStatus } from "@/lib/assetUtils";
import AssetTileStatusIndicator from "./AssetTileStatusIndicator";
import { Asset } from "@/types/assistant";
import { cn } from "@/lib/utils";

const AssetStatusIndicatorBar = ({
  asset,
  variant,
}: {
  asset: Asset;
  variant: "tile" | "tree";
}) => {
  const statusCounter = collectChildrenStatus(asset);
  if (statusCounter === undefined) {
    return <></>;
  }

  return (
    <div
      className={cn(
        "group-hover:opacity-100 flex flex-row  p-2 group-hover:bg-white rounded-md",
        variant === "tile" && "opacity-100 absolute bottom-1 right-1",
        variant === "tree" && "opacity-30"
      )}
    >
      <AssetTileStatusIndicator
        counter={statusCounter.RECOMMENDED}
        variant={"RECOMMENDED"}
      />
      <AssetTileStatusIndicator
        counter={statusCounter.IN_PROCESS}
        variant={"IN_PROCESS"}
      />
      <AssetTileStatusIndicator
        counter={statusCounter.IMPLEMENTED}
        variant={"IMPLEMENTED"}
      />
      <AssetTileStatusIndicator
        counter={statusCounter.IRRELEVANT}
        variant={"IRRELEVANT"}
      />
      {statusCounter.RECOMMENDED +
        statusCounter.IN_PROCESS +
        statusCounter.IMPLEMENTED +
        statusCounter.IRRELEVANT <=
        0 && <AssetTileStatusIndicator counter={0} variant={"DEFAULT"} />}
    </div>
  );
};

export default AssetStatusIndicatorBar;
