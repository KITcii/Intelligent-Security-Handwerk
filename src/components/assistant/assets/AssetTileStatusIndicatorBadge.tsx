import { cn } from "@/lib/utils";
import React from "react";

const AssetTileStatusIndicatorBadge = ({
  color,
  counter,
}: {
  color: string;
  counter: number;
}) => {
  return (
    <div
      className={cn(
        "h-8 min-w-8 p-2 grid content-center rounded-full text-tc-contrast text-center text-base hover:bg-contrast-light hover:text-tc",
        color,
        "ms-[-8px] group-hover:ms-1 transition-all duration-150"
      )}
    >
      {counter}
    </div>
  );
};

export default AssetTileStatusIndicatorBadge;
