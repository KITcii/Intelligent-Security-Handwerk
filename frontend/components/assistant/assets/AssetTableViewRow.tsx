import { TableCell, TableRow } from "@/components/ui/table";

const AssetTableViewRow = ({ data }: { data: string[][] }) => {
  if (data === undefined) {
    return <></>;
  } else {
    return (
      <>
        {data.map((row, index) => {
          if (row.length === 2) {
            // category asset
            return (
              <TableRow key={`print_table_row_${index}_asset_${row[0]}`}>
                <TableCell className="font-semibold bg-slate-300">
                  {row[0]}
                </TableCell>
                <TableCell colSpan={3} className="font-semibold bg-slate-300">
                  {row[1]}
                </TableCell>
              </TableRow>
            );
          } else {
            // lowest level asset
            return (
              <TableRow
                key={`print_table_row_${index}_asset_${row[0]}`}
                className="text-base"
              >
                <TableCell>{row[0]}</TableCell>
                <TableCell className="max-w-[200px]">{row[1] || ""}</TableCell>
                <TableCell>{row[2] || ""}</TableCell>
                <TableCell className="max-w-[300px] overflow-hidden text-wrap break-all">
                  <div className="flex flex-col gap-2">
                    {row[3].split(/;\s*/).map((line, index) => {
                      return (
                        <div
                          key={`print_table_row_${index}_asset_${row[0]}`}
                          className="leading-tight"
                        >
                          {line}
                        </div>
                      );
                    })}
                  </div>
                </TableCell>
              </TableRow>
            );
          }
        })}
      </>
    );
  }
};

export default AssetTableViewRow;
