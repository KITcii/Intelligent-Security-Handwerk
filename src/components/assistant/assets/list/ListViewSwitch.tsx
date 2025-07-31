"use client";

import { Button } from "@/components/ui/button";
import { AssetListViewsValues } from "@/constants/assistant";
import { cn, updatePramsFromUrlQuery } from "@/lib/utils";
import { AssetListViews } from "@/types/assistant";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ListViewSwitch = ({
  defaultView,
  className,
}: {
  defaultView: AssetListViews;
  className?: string;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [view, setView] = useState<AssetListViews>(defaultView);

  const changeView = (view: AssetListViews) => {
    router.replace(
      updatePramsFromUrlQuery({
        params: searchParams?.toString() || "",
        data: [
          // reset filters when updating the view mode
          { key: "view", value: view },
          { key: "pid", value: undefined },
        ],
      }),
      { scroll: false }
    );
  };

  useEffect(() => {
    const viewFromUrl =
      searchParams?.get("view") !== null
        ? searchParams?.get("view")
        : defaultView;
    if (AssetListViewsValues.includes(viewFromUrl as AssetListViews)) {
      setView(viewFromUrl as AssetListViews);
    } else {
      setView(defaultView);
    }
  }, [defaultView, searchParams]);

  return (
    <div className={cn("flex flex-row", className)}>
      <Button
        className={cn(
          view === "tree" ? "button-success" : "button-subtle",
          "rounded-tr-none rounded-br-none transition-all duration-300 w-full"
        )}
        onClick={() => changeView("tree")}
      >
        <i className="material-symbols-outlined me-4">account_tree</i> Baum
      </Button>
      <Button
        className={cn(
          view === "tiles" ? "button-success" : "button-subtle",
          "rounded-tl-none rounded-bl-none transition-all duration-300 w-full"
        )}
        onClick={() => changeView("tiles")}
      >
        <i className="material-symbols-outlined me-4">grid_view</i> Kacheln
      </Button>
    </div>
  );
};

export default ListViewSwitch;
