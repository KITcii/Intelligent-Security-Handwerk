"use client";

import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const labels = {
    type: "Angebotstyp",
    name: "Angebot",
    topics: "Inhalte",
    provider: "Anbieter",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-10 lg:flex text-base"
        >
          <i className="material-symbols-outlined md-s me-2">tune</i>
          Spalten
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[170px] px-2 py-2">
        <DropdownMenuLabel className="text-base">
          Sichtbare Spalten
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize text-base"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {Object.hasOwn(labels, column.id)
                  ? labels[column.id as keyof typeof labels]
                  : column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
