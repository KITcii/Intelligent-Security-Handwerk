"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { StandardSubArea, StandardSubAreaData } from "@/types/assistant";
import { MouseEvent } from "react";

const StandardBuildingBlock = ({
  area,
  values,
  className,
}: {
  area: StandardSubArea;
  values: StandardSubAreaData[];
  className?: string;
}) => {
  const handleMouseEvents = (e: MouseEvent<HTMLDivElement>) => {
    const labels = document
      ?.getElementById("spiderWidget")
      ?.getElementsByClassName("spiderLabel");
    if (labels !== undefined) {
      for (let i = 0; i < labels.length; i++) {
        if (labels[i].textContent === e.currentTarget.textContent) {
          if (e.type === "mouseenter") {
            labels[i].setAttribute("style", "font-weight:bold");
            labels[i].nextElementSibling?.setAttribute("style", "opacity:1");
          } else if (e.type === "mouseleave") {
            labels[i].setAttribute("style", "font-weight:normal");
            labels[i].nextElementSibling?.setAttribute("style", "opacity:0");
          }
        }
      }
    }
  };

  const percent =
    Math.round(
      (values.find((v) => v.standardElementId === area.id)?.coverage || 0) *
        1000
    ) / 10;

  return (
    <Dialog>
      <DialogTrigger className={className}>
        <div
          className=" h-min p-2 px-4 text-center rounded bg-contrast-semidark hover:bg-highlight-100 cursor-pointer"
          onMouseEnter={handleMouseEvents}
          onMouseLeave={handleMouseEvents}
        >
          {area.name}
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{area.name}</DialogTitle>
          <DialogDescription className="text-base text-tc whitespace-pre-wrap">
            {area.description}
          </DialogDescription>
        </DialogHeader>
        <div className="bg-contrast-light p-4 rounded-sm">
          <span className="font-semibold">
            Umgesetzte Maßnahmen des Bausteins
          </span>
          <div className="mt-1 h-8 outline outline-1 outline-contrast-neutral outline-offset-2 bg-white rounded-xl">
            <div
              className={cn(
                "h-full flex items-center bg-highlight-100  rounded-xl"
              )}
              style={{ width: `${percent}%` }}
            >
              <div className=" ms-4">{percent}%</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StandardBuildingBlock;
