import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GlossaryEntryLight } from "@/types/assistant";
import Link from "next/link";

const TermTooltip = ({
  term,
  entry,
}: {
  term: string;
  entry: GlossaryEntryLight;
}) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger>
          <Link
            href={`/assistant/glossary/details/entry/${entry.id}`}
            className="underline decoration-dashed decoration-1 decoration-contrast-dark/80 underline-offset-2"
          >
            {term}
          </Link>
        </TooltipTrigger>
        <TooltipContent className="max-w-72 text-left bg-contrast-dark text-tc-contrast p-4 flex flex-row gap-2 items-center align-middle">
          <div className="h-full">
            <i className="material-symbols-outlined md-xl">shield_question</i>
          </div>
          <span>{entry.definition}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TermTooltip;
