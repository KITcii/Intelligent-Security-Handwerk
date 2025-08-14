"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RecommendationStatusLabels } from "@/constants/assistant";
import { RecommendationStatus } from "@/types/assistant";
import { useContext, useTransition } from "react";
import { toast } from "sonner";
import { FORM_UPDATE_ERROR, FORM_UPDATE_SUCCESS } from "@/constants/dialog";
import { toggelRecommendationRelevancy } from "@/lib/actions/recommendations.action";
import { NotificationsContext } from "@/contexts/NotificationsProvider";

const OverviewStatusMenu = ({
  id,
  status,
}: {
  id: string;
  status: RecommendationStatus;
}) => {
  // current limitation: when multiple state updates are triggered in a short time frame,
  // the transitions are batched together by react https://react.dev/reference/react/useTransition
  const [isPending, startTransition] = useTransition();
  const { refreshRecommendationsCounter } = useContext(NotificationsContext);

  const handleAction = async (entryId: string) => {
    const response = await toggelRecommendationRelevancy(entryId);
    if (response.success) {
      toast.success(response.message ?? FORM_UPDATE_SUCCESS);
    } else {
      toast.error(response.message ?? FORM_UPDATE_ERROR);
    }
    refreshRecommendationsCounter();
  };

  return (
    <DropdownMenu key={id}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="group w-full hover:bg-inherit"
          disabled={isPending}
          aria-disabled={isPending}
        >
          <div className="flex flex-row gap-2 text-base cursor-pointer w-full">
            <p className="text-base text-nowrap group-hover:underline">
              {RecommendationStatusLabels.get(status) ?? "Unbekannt"}
            </p>
            <i className="material-symbols-outlined text-tc-muted group-disabled:animate-reverse-spin">
              {isPending ? "replay" : "keyboard_arrow_down"}
            </i>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-4" collisionPadding={50}>
        <DropdownMenuLabel className="text-base">
          Sichtbarkeit ändern
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-base cursor-pointer pe-5"
          onSelect={() => {
            startTransition(() => {
              handleAction(id).catch(() => {
                toast.error(FORM_UPDATE_ERROR);
              });
            });
          }}
        >
          <div className="flex items-center align-middle">
            <i className="material-symbols-outlined md-s bold w-7">
              {status === "irrelevant" ? "visibility" : "visibility_off"}
            </i>
            <span className="text-base">
              {status === "irrelevant" ? "Einblenden" : "Ausblenden"}
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OverviewStatusMenu;
