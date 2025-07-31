import { cn } from "@/lib/utils";
import { RecommendationSeverity } from "@/types/assistant";

const ThreatIndicator = ({ level }: { level: RecommendationSeverity }) => {
  // Default values
  let bg = "bg-contrast-neutral";
  let text = "text-tc";
  let textSize = "text-3xl";
  let border = "bg-contrast-semidark";
  let label = "?";

  switch (level) {
    case "CRITICAL":
      bg = "bg-danger-critical/80";
      text = "text-tc-contrast";
      border = "border-danger-critical";
      label = "KRITISCH";
      textSize = "text-2xl";
      break;
    case "HIGH":
      bg = "bg-danger-high";
      text = "text-tc-contrast";
      border = "border-danger-critical/40";
      label = "HOCH";
      break;
    case "MEDIUM":
      bg = "bg-danger-mid";
      text = "text-tc-contrast";
      border = "border-danger-critical/20";
      label = "MITTEL";
      break;
    case "LOW":
      bg = "bg-danger-low";
      text = "text-tc-contrast";
      border = "border-danger-critical/20";
      label = "NIEDRIG";
      break;
    default:
      bg = "bg-contrast-dark";
      text = "text-tc-contrast";
      border = "border-contrast-semidark";
      label = "?";
      break;
  }

  return (
    <div
      className={cn(
        "border-[1rem] w-40 h-40 rounded-full font-semibold flex items-center",
        bg,
        text,
        border,
        textSize
      )}
    >
      <div className="w-full text-center">{label}</div>
    </div>
  );
};

export default ThreatIndicator;
