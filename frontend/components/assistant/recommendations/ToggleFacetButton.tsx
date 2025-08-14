import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ToggleFacetButton = ({
  label,
  count,
  isSelected,
  subtle = false,
  onClickHandler,
}: {
  label: string;
  count: number;
  isSelected: boolean;
  subtle?: boolean;
  onClickHandler: () => void;
}) => {
  return (
    <Button
      className={cn(
        "group",
        subtle && !isSelected && "button-subtle",
        isSelected ? "button-success text-tc-contrast" : "button-outline"
      )}
      variant="outline"
      onClickCapture={onClickHandler}
    >
      {label}
      <div
        className={cn(
          "ms-4 h-6 min-w-6 px-2 rounded-full justify-center items-center text-center font-semibold text-base text-tc-muted bg-contrast-light"
        )}
      >
        {count}
      </div>
    </Button>
  );
};

export default ToggleFacetButton;
