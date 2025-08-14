import { cn } from "@/lib/utils";
import SimpleTooltip from "./SimpleTooltip";

const StatusDot = ({
  label,
  style = "default",
  className,
}: {
  label?: string;
  style?: string;
  className?: string;
}) => {
  const colors = {
    center: "bg-contrast-dark",
    outline: "outline-contrast-neutral",
    text: "text-tc",
  };
  switch (style) {
    case "critical":
      colors.center = "bg-danger-critical";
      colors.outline = "outline-danger-critical/50";
      colors.text = "text-danger-critical";
      break;
    case "danger":
      colors.center = "bg-danger-high";
      colors.outline = "outline-danger-high/50";
      colors.text = "text-danger-high";
      break;
    case "warning":
      colors.center = "bg-danger-mid";
      colors.outline = "outline-danger-mid/50";
      colors.text = "text-danger-mid";
      break;
    case "neutral":
      colors.center = "bg-contrast-semidark";
      colors.outline = "outline-contrast-neutral";
      colors.text = "text-tc";
      break;
    case "success":
      colors.center = "bg-shamrock";
      colors.outline = "outline-shamrock-200";
      colors.text = "text-shamrock";
      break;
    case "default":
      colors.center = "bg-shakespeare";
      colors.outline = "outline-shakespeare-200";
      colors.text = "text-shakespeare";
      break;
    default:
      colors.center = "bg-contrast-dark";
      colors.outline = "outline-contrast-neutral";
      colors.text = "text-tc";
      break;
  }
  return (
    <div className={cn("whitespace-nowrap", className)}>
      <SimpleTooltip text={label}>
        <i
          className={cn(
            "h-2 aspect-square rounded-full outline outline-2 inline-block align-middle me-2",
            colors.center,
            colors.outline
          )}
        ></i>
      </SimpleTooltip>
      {label && (
        <span className={cn("inline-block align-middle", colors.text)}>
          {label}
        </span>
      )}
    </div>
  );
};

export default StatusDot;
