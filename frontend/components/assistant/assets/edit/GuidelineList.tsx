"use client";

import ProgressBar from "@/components/shared/ProgressBar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { NotificationsContext } from "@/contexts/NotificationsProvider";
import { updateGuidelineSelection } from "@/lib/actions/assets.action";
import { cn } from "@/lib/utils";
import { AssetInstance, MeasureGuideline } from "@/types/assistant";
import React, { useContext, useState, useTransition } from "react";

const GuidelineList = ({
  guidelines,
  instance,
  controlId,
  variant,
  refreshData,
}: {
  guidelines: MeasureGuideline[];
  instance?: AssetInstance;
  controlId: string;
  fake?: boolean;
  variant: "measure" | "recommendation";
  refreshData: (instance: AssetInstance | undefined) => void;
}) => {
  const [activeGuidelines, setActiveGuidelines] = useState<number[]>(
    instance?.implementedGuidelines || []
  );
  const [isPending, startTransition] = useTransition();
  const { refreshRecommendationsCounter } = useContext(NotificationsContext);

  const handleCheckedChange = (pos: number, checked: boolean) => {
    let newState: number[] = [];
    if (checked) {
      newState = [...activeGuidelines, pos];
    } else {
      newState = activeGuidelines.filter((p) => p !== pos);
    }

    setActiveGuidelines(newState);
    performUpdate(newState);
  };

  const performUpdate = (newState: number[]) => {
    startTransition(() =>
      updateGuidelineSelection(controlId, newState)
        .then((res) => {
          if (res.success) {
            refreshData((res.payload as AssetInstance) || undefined);
          }
        })
        .catch(() => {})
        .finally(() => {
          refreshRecommendationsCounter();
        })
    );
  };

  const handleToggleAll = () => {
    if (activeGuidelines.length === guidelines.length) {
      setActiveGuidelines([]);
      performUpdate([]);
    } else {
      const newState = guidelines.map((g) => g.position);
      setActiveGuidelines(newState);
      performUpdate(newState);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="font-semibold">
        Die{" "}
        {variant === "measure"
          ? "Maßnahme"
          : variant === "recommendation" && "Handlungsempfehlung"}{" "}
        gilt als umgesetzt, wenn die folgende Unterpunkte erfüllt sind:
      </h1>
      {instance && instance.status !== "IRRELEVANT" ? (
        <div className="space-y-2">
          <div className=" space-y-[1px]">
            <div className="grid grid-cols-8">
              <div className="col-span-2 bg-contrast-light p-2 font-semibold">
                Umgesetzt
              </div>
              <div className="col-span-6 bg-contrast-light p-2 text-right">
                {`${Math.round(((instance.implementedGuidelines?.length || 0) / guidelines.length) * 100)}%`}
              </div>
            </div>
            {guidelines.map((guideline, index) => {
              const selected =
                activeGuidelines?.includes(guideline.position) || false;
              return (
                <div
                  key={`guideline_item_${guideline.position}_${index}`}
                  className={cn(
                    "grid grid-cols-8 hover:bg-contrast-light cursor-pointer",
                    index % 2 === 0 ? "" : "bg-contrast-verylight",
                    selected &&
                      "bg-highlight-100/30 hover:bg-highlight-100 hover:text-tc-contrast",
                    isPending && "text-tc-muted"
                  )}
                >
                  <div className="flex w-full h-full align-middle items-center justify-center">
                    <Checkbox
                      checked={selected}
                      onCheckedChange={(e) =>
                        handleCheckedChange(guideline.position, e as boolean)
                      }
                      id={`guideline_checkbox_${guideline.position}_${index}`}
                      disabled={isPending}
                      className="mt-[4px]"
                    />
                  </div>
                  <div className="col-span-7 px-4 py-2">
                    <label
                      htmlFor={`guideline_checkbox_${guideline.position}_${index}`}
                      className="text-base cursor-pointer"
                    >
                      {guideline.description}
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-row items-center justify-between flex-between">
            <Button
              className="button-subtle"
              onClick={handleToggleAll}
              disabled={isPending}
            >
              <i className="material-symbols-outlined md-m me-2">
                {activeGuidelines.length === guidelines.length
                  ? "check_box_outline_blank"
                  : "done_all"}
              </i>
              Alle{" "}
              {activeGuidelines.length === guidelines.length
                ? "abwählen"
                : "auswählen"}
            </Button>
            <div className="flex flex-row items-center gap-3">
              {isPending && (
                <>
                  <ProgressBar
                    progress={50}
                    spinner={true}
                    style="bold"
                    className="w-6"
                  />
                  <span>Aktualisiere Daten...</span>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-2 pt-1">
          <ul>
            {guidelines.map((guideline, index) => {
              return (
                <li
                  key={`measure_${guideline.position}_${index}`}
                  className="flex flex-row items-start list-outside gap-4 hover:bg-contrast-verylight py-2 px-4 rounded-md"
                >
                  <i className="material-symbols-outlined filled md-s">
                    fiber_manual_record
                  </i>
                  {guideline.description}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GuidelineList;
