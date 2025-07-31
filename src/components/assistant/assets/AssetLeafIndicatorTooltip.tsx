import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

const AssetLeafIndicatorTooltip = ({
  variant,
  label,
  children,
}: {
  variant: "infrastructure" | "measures";
  label?: string;
  children: React.ReactNode;
}) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <a type="button">{children}</a>
        </TooltipTrigger>
        <TooltipContent>
          <span className="text-base">
            {variant === "infrastructure"
              ? "Diese Komponente ist Teil Ihrer IT-Infrastruktur"
              : (variant === "measures" && label) || ""}
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AssetLeafIndicatorTooltip;
