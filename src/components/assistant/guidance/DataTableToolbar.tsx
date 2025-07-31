"use client";

import { Table } from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { ServicesTableFacets } from "@/types/assistant";
import { Dispatch, SetStateAction } from "react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filters: ServicesTableFacets;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
  globalFilter: string;
}

export function DataTableToolbar<TData>({
  table,
  filters,
  globalFilter,
  setGlobalFilter,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  return (
    <div className="flex justify-start">
      <div className="flex flex-1 gap-3 flex-wrap items-center">
        <div className="w-full md:max-w-[350px] relative">
          <Input
            placeholder="Suche in Angeboten..."
            value={globalFilter ?? ""}
            onChange={(value) =>
              setGlobalFilter(String(value.currentTarget.value))
            }
            className="rounded-full ps-5 py-4 h-12 text-base"
          />
          {globalFilter !== "" ? (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 right-5"
              onClick={() => setGlobalFilter("")}
            >
              <i className="material-symbols-outlined bold text-contrast-semidark">
                close
              </i>
            </Button>
          ) : (
            <i className="absolute right-5 material-symbols-outlined bold text-contrast-semidark top-3">
              search
            </i>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {filters !== undefined &&
            filters.map((filter, index) => {
              if (table.getColumn(filter.column)) {
                return (
                  <DataTableFacetedFilter
                    key={`filter_${index}`}
                    column={table.getColumn(filter.column)}
                    columnId={filter.column}
                    title={filter.title}
                    options={filter.data}
                  />
                );
              }
              return <></>;
            })}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-12 px-2 lg:px-3 text-base"
            >
              Zurücksetzen
              <i className="material-symbols-outlined md-s ms-2">cancel</i>
            </Button>
          )}
        </div>
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
