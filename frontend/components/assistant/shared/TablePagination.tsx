import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TablePagination = ({ table }: { table: Table<any> }) => {
  return (
    <div className="flex flex-row gap-10">
      <div className="flex flex-row items-center align-middle gap-2 text-tc-muted">
        <div>Anzeige pro Seite:</div>
        <Select
          onValueChange={(e) => table.setPageSize(Number(e))}
          defaultValue={table.getState().pagination.pageSize.toString()}
        >
          <SelectTrigger className="w-20">
            <SelectValue
              placeholder={table.getState().pagination.pageSize.toString()}
              className="text-base"
            />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 25, 50, 100].map((pageSize) => (
              <SelectItem
                key={pageSize}
                value={pageSize.toString()}
                className="text-base"
              >
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-row items-center align-middle gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          aria-disabled={!table.getCanPreviousPage()}
          className="button-outline"
        >
          <i className="material-symbols-outlined md-s me-1">
            chevron_backward
          </i>
          Zurück
        </Button>
        <div className="text-tc-muted">
          {table.getState().pagination.pageIndex + 1} von{" "}
          {table.getPageCount() > 0 ? table.getPageCount() : 1}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          aria-disabled={!table.getCanPreviousPage()}
          className="button-outline"
        >
          Weiter
          <i className="material-symbols-outlined md-s ms-1">chevron_forward</i>
        </Button>
      </div>
    </div>
  );
};

export default TablePagination;
