import * as React from "react";
import { Column } from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { SupportServiceTypeLabels } from "@/constants/assistant";
import { SupportServiceType } from "@/types/assistant";

interface DataTableFacetedFilterProps<TData, TValue> {
  columnId?: string;
  column?: Column<TData, TValue>;
  title?: string;
  options: string[];
}

export function DataTableFacetedFilter<TData, TValue>({
  columnId,
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-base h-12 border-dashed"
        >
          <i className="material-symbols-outlined md-s me-2">add_circle</i>
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal text-base lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal text-base"
                >
                  {selectedValues.size} ausgewählt
                </Badge>
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} className="text-base" />
          <CommandList>
            <CommandEmpty className="text-base p-4 text-center">
              Keine Einträge gefunden.
            </CommandEmpty>
            <CommandGroup>
              {options.map((option, index) => {
                const isSelected = selectedValues.has(option);
                return (
                  <CommandItem
                    key={`${columnId}_option_${index}`}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option);
                      } else {
                        selectedValues.add(option);
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      );
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-5 w-5 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <i className="material-symbols-outlined md-s">check</i>
                    </div>
                    <span className="text-base">
                      {columnId === "type"
                        ? SupportServiceTypeLabels.get(
                            option as SupportServiceType
                          )
                        : option}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center text-base"
                  >
                    Filter zurücksetzen
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
