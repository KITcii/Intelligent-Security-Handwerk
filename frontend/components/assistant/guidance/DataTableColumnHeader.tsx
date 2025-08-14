import { Column } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className, "text-base")}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent text-base"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <i className="material-symbols-outlined md-s ms-2">
                arrow_downward
              </i>
            ) : column.getIsSorted() === "asc" ? (
              <i className="material-symbols-outlined md-s ms-2">
                arrow_upward
              </i>
            ) : (
              <i className="material-symbols-outlined md-s ms-2">swap_vert</i>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel className="text-base">
            Spaltensortierung
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => column.toggleSorting(false)}
            className="text-base"
          >
            <i className="material-symbols-outlined md-s me-2">arrow_upward</i>
            Aufsteigend
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => column.toggleSorting(true)}
            className="text-base"
          >
            <i className="material-symbols-outlined md-s me-2">
              arrow_downward
            </i>
            Absteigend
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => column.toggleVisibility(false)}
            className="text-base"
          >
            <i className="material-symbols-outlined md-s me-2">
              visibility_off
            </i>
            Ausblenden
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
