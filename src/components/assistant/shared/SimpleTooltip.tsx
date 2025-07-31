import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SimpleTooltip = ({
  text,
  children,
}: {
  text?: string;
  children: React.ReactNode;
}) => {
  if (text === undefined) {
    return <>{children}</>;
  }
  return (
    <TooltipProvider delayDuration={10}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="text-base">{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SimpleTooltip;
