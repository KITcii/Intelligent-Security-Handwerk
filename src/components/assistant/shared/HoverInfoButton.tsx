import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { HoverCardPortal } from "@radix-ui/react-hover-card";

const HoverInfoButton = ({
  color,
  text,
  title,
  disabled = false,
  className,
}: {
  color?: string;
  text?: string;
  title?: string;
  disabled?: boolean;
  className?: string;
}) => {
  if (disabled) {
    return (
      <i className={cn("material-symbols-outlined md-s", color, className)}>
        info
      </i>
    );
  } else {
    if (text) {
      return (
        <HoverCard openDelay={50} closeDelay={0}>
          <HoverCardTrigger>
            <i
              className={cn(
                "material-symbols-outlined md-s fillhover cursor-pointer",
                color,
                className
              )}
            >
              info
            </i>
          </HoverCardTrigger>
          <HoverCardPortal>
            <HoverCardContent asChild>
              <div className=" w-96 text-base font-normal flex flex-col gap-4 pb-5 px-5">
                {title && <h1 className="font-semibold">{title}</h1>}
                {text}
              </div>
            </HoverCardContent>
          </HoverCardPortal>
        </HoverCard>
      );
    }
    return <></>;
  }
};

export default HoverInfoButton;
