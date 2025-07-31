"use client";

import { Column } from "@tanstack/react-table";
import ToggleFacetButton from "./ToggleFacetButton";
import { Fragment } from "react";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  options: Map<string, string>;
}

export function RecommendationsListFacetedFilter<TData, TValue>({
  column,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets: Map<string, number> | undefined =
    column?.getFacetedUniqueValues();

  const selectedValues = new Set(column?.getFilterValue() as string[]);
  return (
    <div>
      <div></div>
      <div className="flex flex-row gap-4 items-center align-middle">
        <div className="font-semibold">Zeige nur: </div>
        {options?.entries() &&
          Array.from(options?.entries()).map(([tag, label], i) => {
            const isSelected = selectedValues.has(tag);
            return (
              <Fragment key={`facet_${i}`}>
                <ToggleFacetButton
                  label={label}
                  count={facets?.get(tag) ?? 0}
                  isSelected={isSelected}
                  subtle={false}
                  onClickHandler={() => {
                    if (isSelected) {
                      selectedValues.delete(tag);
                    } else {
                      selectedValues.add(tag);
                    }
                    const filterValues = Array.from(selectedValues);
                    column?.setFilterValue(
                      filterValues.length ? filterValues : undefined
                    );
                  }}
                />
              </Fragment>
            );
          })}
        <ToggleFacetButton
          label="Alle"
          count={column?.getFacetedRowModel()?.rows.length ?? 0}
          isSelected={selectedValues.size === 0}
          subtle={true}
          onClickHandler={() => {
            selectedValues.clear();
            column?.setFilterValue(undefined);
          }}
          key={`facet_reset`}
        />
      </div>
    </div>
  );
}
