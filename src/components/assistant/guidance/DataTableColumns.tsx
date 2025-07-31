"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SupportServiceEntry } from "@/types/assistant";
import {
  SupportServiceTypeIcons,
  SupportServiceTypeLabels,
} from "@/constants/assistant";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SupportServiceDetails from "../recommendations/details/SupportServiceDetails";

export const DataTableColumns: ColumnDef<SupportServiceEntry>[] = [
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Typ" className="ms-4" />
    ),
    cell: ({ row }) => {
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>
              <Badge className="text-center text-tc-contrast h-12 w-12 ms-2 mt-2 drop-shadow bg-highlight-50 cursor-help">
                <i className="material-symbols-outlined">
                  {SupportServiceTypeIcons.get(
                    row.original["offer"]?.type || "OTHER"
                  )}
                </i>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              {SupportServiceTypeLabels.get(
                row.original["offer"]?.type || "OTHER"
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      if (Array.isArray(filterValue)) {
        return filterValue.includes(row.original["offer"]?.type);
      }
      return row.original["offer"]?.type == filterValue;
    },
    enableSorting: false,
    enableGlobalFilter: false,
  },
  {
    id: "name",
    accessorFn: (row) => `${row.offer?.name} ${row.offer?.description}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Angebot" />
    ),
    cell: ({ row }) => {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <div className="cursor-pointer">
              <h3 className="font-semibold">{row.original["offer"]?.name}</h3>
              <p className="mt-2 text-tc-muted line-clamp-3">
                {row.original["offer"]?.description}
              </p>
            </div>
          </DialogTrigger>
          <DialogContent
            className="max-w-[800px] max-h-screen bg-contrast-light overflow-y-scroll"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <SupportServiceDetails service={row.original} />
          </DialogContent>
        </Dialog>
      );
    },
    enableSorting: false,
    enableGlobalFilter: true,
  },
  {
    accessorKey: "topics",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inhalte" />
    ),
    cell: ({ row }) => {
      return (
        <div>
          <ul className="ps-5">
            {row.original["offer"]?.topics?.map((topic, index) => {
              return (
                <li
                  key={`topic_${topic.id}_pos_${index}`}
                  className="list-disc list-outside mb-[0.4rem]"
                >
                  {topic.name}
                </li>
              );
            })}
          </ul>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const rowValues = row.original["offer"]?.topics?.map(
        (topic) => topic.name
      );
      if (rowValues === undefined) {
        return false;
      }
      if (Array.isArray(filterValue)) {
        return filterValue.some((r: string) => rowValues.includes(r));
      }
      return rowValues.includes(filterValue as string);
    },
    enableSorting: false,
    enableGlobalFilter: false,
  },

  {
    accessorKey: "provider",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Anbieter" />
    ),
    cell: ({ row }) => {
      return (
        <Dialog>
          <DialogTrigger className="text-left text-base inline-link">
            {row.original["provider"]?.name}
          </DialogTrigger>
          <DialogContent className="max-w-[800px] max-h-screen bg-contrast-light overflow-y-scroll">
            <SupportServiceDetails service={row.original} />
          </DialogContent>
        </Dialog>
      );
    },

    filterFn: (row, columnId, filterValue) => {
      if (Array.isArray(filterValue)) {
        return filterValue.includes(row.original["provider"]?.name);
      }
      return row.original["provider"]?.name == filterValue;
    },
    enableSorting: false,
    enableGlobalFilter: false,
  },
];
