import { Column } from "@tanstack/react-table";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TableSortingIndicator = ({ column }: { column: Column<any> }) => {
  return (
    <div className="w-5 h-full flex flex-col justify-center text-right">
      {column.getCanSort() && column.getIsSorted() ? (
        <i className="material-symbols-outlined md-xs bold">
          {column.getIsSorted() === "desc" ? "arrow_upward" : "arrow_downward"}
        </i>
      ) : (
        ""
      )}
    </div>
  );
};

export default TableSortingIndicator;
