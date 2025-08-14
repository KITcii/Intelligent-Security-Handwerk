"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useState } from "react";
import BackgroundPanel from "@/components/assistant/shared/BackgroundPanel";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";
import StatusDot from "@/components/assistant/shared/StatusDot";
import { Input } from "@/components/ui/input";
import SettingsAddUser from "./SettingsAddUser";
import SettingsReinviteUser from "./SettingsReinviteUser";
import SettingsDeleteUser from "./SettingsDeleteUser";
import TableSortingIndicator from "../../shared/TableSortingIndicator";
import { UserRoleLabels } from "@/constants/user";
import { BackendUser } from "@/types/assistant";
import SimpleTooltip from "../../shared/SimpleTooltip";

export const columns: ColumnDef<BackendUser>[] = [
  {
    id: "symbol",
    header: () => {
      return <></>;
    },
    cell: ({ row }) => {
      return (
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="cursor-default">
                <i
                  className={cn(
                    "material-symbols-outlined text-highlight-100",
                    row.getValue<string[]>("roles").includes("OWNER") &&
                      "filled"
                  )}
                >
                  person
                </i>
              </TooltipTrigger>
              <TooltipContent className="text-base">
                {row.getValue<string[]>("roles").includes("OWNER")
                  ? UserRoleLabels.OWNER
                  : row.getValue<string[]>("roles").includes("USER")
                    ? UserRoleLabels.USER
                    : "Unbekannt"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
    enableSorting: false,
    meta: { className: "pe-0 me-0" },
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
          className="CardStyleTableColumnHeadButton"
        >
          Vorname
          <TableSortingIndicator column={column} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <SimpleTooltip text={row.getValue("firstName")}>
        <div className="text-base font-semibold max-w-20 lg:max-w-28 2xl:max-w-full overflow-hidden text-ellipsis">
          {row.getValue("firstName")}
        </div>
      </SimpleTooltip>
    ),
    enableGlobalFilter: true,
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
          className="CardStyleTableColumnHeadButton"
        >
          Nachname
          <TableSortingIndicator column={column} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <SimpleTooltip text={row.getValue("lastName")}>
        <div className="text-base max-w-20 lg:max-w-28 2xl:max-w-full overflow-hidden text-ellipsis">
          {row.getValue("lastName")}
        </div>
      </SimpleTooltip>
    ),
    enableGlobalFilter: true,
  },
  {
    accessorKey: "roles",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
          className="CardStyleTableColumnHeadButton"
        >
          Rolle
          <TableSortingIndicator column={column} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-base">
        {row.getValue<string[]>("roles").includes("OWNER")
          ? UserRoleLabels.OWNER
          : row.getValue<string[]>("roles").includes("USER")
            ? UserRoleLabels.USER
            : "Unbekannt"}
      </div>
    ),
    meta: { className: "max-[1200px]:hidden" },
  },
  {
    accessorKey: "mail",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
          className="CardStyleTableColumnHeadButton"
        >
          E-Mail
          <TableSortingIndicator column={column} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <SimpleTooltip text={row.getValue("mail")}>
        <div className="text-base max-w-24 lg:max-w-32 2xl:max-w-full overflow-hidden text-ellipsis">
          {row.getValue("mail")}
        </div>
      </SimpleTooltip>
    ),
    enableGlobalFilter: true,
    meta: { className: "max-md:hidden" },
  },
  {
    accessorKey: "verified",
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
      <div className="capitalize text-base">
        <StatusDot
          style={row.getValue<boolean>("verified") ? "success" : "neutral"}
          label={row.getValue<boolean>("verified") ? "Aktiv" : "Eingeladen"}
          className="max-xl:[&>*:nth-child(2)]:hidden"
        />
      </div>
    ),
    meta: { className: "max-sm:hidden" },
  },
  {
    accessorKey: "tools",
    header: () => {
      return <></>;
    },
    cell: ({ row }) => (
      <div className="flex flex-col md:flex-row gap-2 justify-end min-h-10">
        {!row.getValue<boolean>("verified") && (
          <SettingsReinviteUser userID={row.original.id} />
        )}
        {row.getValue<string[]>("roles").includes("USER") &&
          !row.getValue<string[]>("roles").includes("OWNER") && (
            <SettingsDeleteUser userID={row.original.id} />
          )}
      </div>
    ),
    enableSorting: false,
    meta: { className: "xl:min-w-40" },
  },
];

const SectionUsersManagementTable = ({ data }: { data: BackendUser[] }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    globalFilterFn: "includesString",
    enableFilters: true,
    enableGlobalFilter: true,
    enableSorting: true,
    enableSortingRemoval: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  return (
    <div className="w-full">
      <BackgroundPanel>
        <div className="mb-5">
          <h1 className="text-lg font-bold">Benutzerliste</h1>
        </div>
        <div className="flex flex-col md:flex-row md:flex-between gap-4">
          <div className="flex flex-1 gap-3 flex-wrap items-center">
            <div className="w-full md:max-w-[350px] relative">
              <Input
                placeholder="Suche nach Benutzer..."
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
                  className={cn("absolute top-1 right-5")}
                  onClick={() => setGlobalFilter("")}
                >
                  <i className="material-symbols-outlined bold text-contrast-semidark">
                    close
                  </i>
                </Button>
              ) : (
                <i
                  className={cn(
                    "absolute right-5 material-symbols-outlined bold text-contrast-semidark top-3"
                  )}
                >
                  search
                </i>
              )}
            </div>
          </div>
          <SettingsAddUser />
        </div>
        <div className="max-w-full overflow-auto mt-14">
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
                  {" "}
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
        <div className="flex flex-col md:flex-row items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-muted-foreground text-base">
            Gesamtanzahl Benutzerkonten: {table.getCoreRowModel().rows.length}
          </div>

          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="button-outline"
            >
              Zurück
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="button-outline"
            >
              Weiter
            </Button>
          </div>
        </div>
      </BackgroundPanel>
    </div>
  );
};

export default SectionUsersManagementTable;
