"use client";

import { Asset, AssetVariants } from "@/types/assistant";
import React, { useEffect, useState } from "react";
import ContentSearch from "../../shared/ContentSearch";
import ListViewSwitch from "./ListViewSwitch";
import ListExportButton from "./ListExportButton";
import ListFacetFilter from "./ListFacetFilter";
import ListSelectedFilter from "./ListSelectedFilter";
import BackgroundPanel from "../../shared/BackgroundPanel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

const ListToolbar = ({
  variant,
  assets,
}: {
  variant: AssetVariants;
  assets: Asset[] | undefined;
}) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<boolean>(false);
  const [queryFilter, setQueryFilter] = useState<string | undefined>(undefined);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams?.get("query") !== queryFilter) {
      setQueryFilter(searchParams?.get("query") || undefined);
    }
    if ((searchParams?.get("selected") === "true") !== selectedFilter) {
      setSelectedFilter(searchParams?.get("selected") === "true");
    }
  }, [queryFilter, selectedFilter, searchParams]);

  return (
    <BackgroundPanel className="flex-none">
      <div className="flex flex-col gap-6">
        <div className="flex flex-row flex-between flex-wrap gap-4">
          <ContentSearch
            placeholder={
              variant === "infrastructure"
                ? "Alle Komponenten durchsuchen..."
                : "Alle Maßnahmen durchsuchen..."
            }
            variant="sm"
            autoClear="reset"
          />
          <Button
            variant="outline"
            onClick={() => setShowOptions((show) => !show)}
            className="text-base max-sm:w-full"
          >
            <i className="material-symbols-outlined md-m me-2">filter_alt</i>
            Optionen
            <i
              className={cn(
                "material-symbols-outlined md-m ms-2 transition-all duration-300",
                showOptions ? "" : "rotate-[-180deg]"
              )}
            >
              keyboard_arrow_down
            </i>
          </Button>
        </div>
        <div
          className={cn(
            showOptions
              ? "flex flex-between flex-wrap gap-4 justify-center items-center"
              : "hidden"
          )}
        >
          <div className="flex flex-row flex-wrap gap-4">
            {variant === "infrastructure" && (
              <>
                <ListFacetFilter variant="tag" className="max-sm:w-full" />
                <ListFacetFilter variant="alias" className="max-sm:w-full" />
                <ListSelectedFilter
                  active={selectedFilter}
                  variant={variant}
                  className="max-sm:w-full"
                />
              </>
            )}
            {variant === "measures" && (
              <ListFacetFilter variant="state" className="max-sm:w-full" />
            )}
          </div>
          <div className="flex flex-row flex-wrap gap-4 max-sm:w-full">
            <ListViewSwitch defaultView="tiles" className="max-sm:w-full" />
            <ListExportButton
              rootAssets={assets}
              variant={variant}
              className="max-sm:w-full"
            />
          </div>
        </div>
      </div>
    </BackgroundPanel>
  );
};

export default ListToolbar;
