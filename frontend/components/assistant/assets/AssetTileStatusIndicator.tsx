import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MeasureDisplayStatus } from "@/types/assistant";
import AssetTileStatusIndicatorBadge from "./AssetTileStatusIndicatorBadge";

const AssetTileStatusIndicator = ({
  counter = 0,
  variant,
}: {
  counter: number;
  variant: MeasureDisplayStatus;
}) => {
  const variantValues: {
    [key: MeasureDisplayStatus]: {
      color: string;
      label: string;
    };
  } = {
    IMPLEMENTED: {
      color: "bg-highlight-100",
      label: "umgesetzten Maßnahmen",
    },
    RECOMMENDED: {
      color: "bg-yellow-500",
      label: "empfohlenen Maßnahmen",
    },
    IN_PROCESS: {
      color: "bg-highlight-50",
      label: "Maßnahmen in Bearbeitung",
    },
    IRRELEVANT: {
      color: "bg-contrast-semidark",
      label: "ausgeblendeten Maßnahmen",
    },
    DEFAULT: {
      color: "bg-contrast-light",
      label: "",
    },
  };

  if (variant === "DEFAULT") {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <a type="button">
              <AssetTileStatusIndicatorBadge
                color={variantValues[variant].color}
                counter={counter}
              />
            </a>
          </TooltipTrigger>
          <TooltipContent className="max-w-72">
            <span className="text-base">
              <span>
                Es wurden noch <b>keine Maßnahmen</b> in der Gruppe ausgewählt
              </span>
            </span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (counter <= 0) {
    return <></>;
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <a type="button">
            <AssetTileStatusIndicatorBadge
              color={variantValues[variant].color}
              counter={counter}
            />
          </a>
        </TooltipTrigger>
        <TooltipContent className="max-w-64">
          <span className="text-base">
            Anzahl der <b>{variantValues[variant].label}</b> in der
            Maßnahmengruppe: <b>{counter}</b>
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AssetTileStatusIndicator;
