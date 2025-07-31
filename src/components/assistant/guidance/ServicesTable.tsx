"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./DataTablePagination";
import { useState } from "react";
import { DataTableToolbar } from "./DataTableToolbar";
import { ServicesTableFacets, SupportServiceEntry } from "@/types/assistant";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  facets: ServicesTableFacets;
}

const ServicesTable = <TData, TValue>({
  columns,
  data,
  facets,
}: DataTableProps<TData, TValue>) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const customFilterFn = (
    rows: unknown,
    columnId: string,
    filterValue: string
  ) => {
    const regex = new RegExp(filterValue, "i");
    const tmp = rows as Row<SupportServiceEntry>;
    return regex.test(
      `${tmp.original["offer"]?.name} ${tmp.original["offer"]?.description} ${tmp.original["provider"]?.name} ${tmp.original["offer"]?.topics?.map((topic) => topic.name).join(" ")}`
    );
  };

  const table = useReactTable({
    data,
    columns,
    globalFilterFn: customFilterFn,
    enableFilters: true,
    enableGlobalFilter: true,
    filterFromLeafRows: false,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      columnFilters,
      globalFilter,
      columnVisibility,
    },
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        filters={facets}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <div>
        <Table className="CardStyleTable">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
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
          <TableBody className="CardStyleTableBody">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="CardTableRow bg-tc-contrast text-base"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="CardTableCell align-top"
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
                  Keine Ergebnisse.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
};

export default ServicesTable;
