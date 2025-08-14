"use client";

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
  getFacetedUniqueValues,
  getFacetedRowModel,
} from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import BackgroundPanel from "../shared/BackgroundPanel";
import { Button, buttonVariants } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";
import StatusDot from "../shared/StatusDot";
import Link from "next/link";
import {
  RecommendationsList,
  RecommendationsListItem,
} from "@/types/assistant";
import TableSortingIndicator from "../shared/TableSortingIndicator";
import { RecommendationsListFacetedFilter } from "./RecommendationsListFacetedFilter";
import RecommendationsOverviewStatusForm from "./RecommendationsOverviewStatusForm";
import {
  RecommendationSeverityLabels,
  RecommendationStatusLabels,
} from "@/constants/assistant";
import OverviewStatusMenu from "./OverviewStatusMenu";
import TablePagination from "../shared/TablePagination";
import ThreatList from "./ThreatList";

export const columns: ColumnDef<RecommendationsListItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableColumnFilter: false,
    meta: { className: "w-12" },
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
          className="CardStyleTableColumnHeadButton"
        >
          Empfehlung
          <TableSortingIndicator column={column} />
        </Button>
      );
    },
    cell: ({ row, cell }) => (
      <div className="font-semibold text-base">
        <Link
          className="inline-link"
          href={`/assistant/recommendations/details/${cell.row.original.id}`}
        >
          {row.getValue("title")}
        </Link>
      </div>
    ),
    enableColumnFilter: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
          className="CardStyleTableColumnHeadButton"
        >
          Status
          <TableSortingIndicator column={column} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <OverviewStatusMenu id={row.original.id} status={row.original.status} />
    ),
    enableColumnFilter: true,
    meta: { className: "max-[500px]:hidden" },
    filterFn: (row, columnId, filterValue: unknown) => {
      if (Array.isArray(filterValue)) {
        return filterValue.includes(row.original["status"]);
      }
      return row.original["status"] == filterValue;
    },
  },

  {
    accessorKey: "bedrohungsmass",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
          className="CardStyleTableColumnHeadButton"
        >
          Bedrohungsmaß <TableSortingIndicator column={column} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <StatusDot
        className="text-base"
        style={
          {
            CRITICAL: "critical",
            HIGH: "danger",
            MEDIUM: "warning",
            LOW: "default",
          }[row.getValue<string>("bedrohungsmass")] ?? "default"
        }
        label={
          RecommendationSeverityLabels.get(row.getValue("bedrohungsmass")) ??
          "Unbekannt"
        }
      />
    ),
    enableColumnFilter: false,
    meta: { className: "max-sm:hidden" },
  },
  {
    accessorKey: "direkteBedrohungen",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
          className="CardStyleTableColumnHeadButton"
        >
          Bedrohungen
          <TableSortingIndicator column={column} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="max-w-[200px]">
        <ThreatList threats={row.original["direkteBedrohungen"]} max={3} />
      </div>
    ),
    enableColumnFilter: false,
    meta: { className: "max-[1200px]:hidden" },
  },
  {
    accessorKey: "tools",
    header: () => {
      return <></>;
    },
    cell: ({ cell }) => (
      <div className="text-right">
        <Link
          className={cn(
            buttonVariants({ variant: "default" }),
            "button-success"
          )}
          href={`/assistant/recommendations/details/${cell.row.original.id}`}
        >
          Öffnen
        </Link>
      </div>
    ),
    enableSorting: false,
    enableColumnFilter: false,
    meta: { className: "xl:min-w-32" },
  },
];

const RecommendationsOverviewContent = ({
  data,
}: {
  data: RecommendationsList;
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    {
      id: "status",
      value: ["open", "in_progress"],
    },
  ]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const table = useReactTable({
    data,
    columns,
    enableSorting: true,
    enableSortingRemoval: true,
    filterFromLeafRows: false,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      rowSelection,
      columnFilters,
      pagination,
    },
  });

  return (
    <div className="w-full">
      <BackgroundPanel bg="bg-contrast-verylight">
        <RecommendationsListFacetedFilter
          column={table.getColumn("status")}
          options={RecommendationStatusLabels}
        />
      </BackgroundPanel>
      <div className="max-w-full overflow-auto mt-8">
        <Table className="CardStyleTable">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(header.column.columnDef.meta?.className)}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className={cn("CardStyleTableBody")}>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn("CardTableRow")}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "CardTableCell",
                        cell.column.columnDef.meta?.className
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-base"
                >
                  Keine Einträge vorhanden.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-row align-top items-start gap-x-2 mt-2">
        <div className="flex-1 mt-2 text-base text-tc-muted">
          {table.getFilteredSelectedRowModel().rows.length} von{" "}
          {table.getFilteredRowModel().rows.length} Empfehlungen ausgewählt.
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <RecommendationsOverviewStatusForm
              rows={table.getFilteredSelectedRowModel().rows}
            />
          )}
        </div>
        <TablePagination table={table} />
      </div>
    </div>
  );
};

export default RecommendationsOverviewContent;
