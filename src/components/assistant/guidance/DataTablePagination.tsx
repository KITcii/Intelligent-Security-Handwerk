import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-base font-medium">Angebote pro Seite</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-10 w-[70px] text-base">
              <SelectValue
                placeholder={table.getState().pagination.pageSize}
                className="text-base"
              />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem
                  key={pageSize}
                  value={`${pageSize}`}
                  className="text-base"
                >
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-base font-medium">
          Seite {table.getState().pagination.pageIndex + 1} von{" "}
          {table.getPageCount() > 0 ? table.getPageCount() : 1}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-10 w-10 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Springe zur ersten Seite</span>
            <i className="material-symbols-outlined md-s">
              keyboard_double_arrow_left
            </i>
          </Button>
          <Button
            variant="outline"
            className="h-10 w-10 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Springe zur vorherigen Seite</span>
            <i className="material-symbols-outlined md-s">
              keyboard_arrow_left
            </i>
          </Button>
          <Button
            variant="outline"
            className="h-10 w-10 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Gehe zur nächsten Seite</span>
            <i className="material-symbols-outlined md-s">
              keyboard_arrow_right
            </i>
          </Button>
          <Button
            variant="outline"
            className="hidden h-10 w-10 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Gehe zur letzten Seite</span>
            <i className="material-symbols-outlined md-s">
              keyboard_double_arrow_right
            </i>
          </Button>
        </div>
      </div>
    </div>
  );
}
