import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Asset, AssetVariants } from "@/types/assistant";
import AssetTableViewRow from "./AssetTableViewRow";
import { convertAssetToTableData } from "@/lib/assetUtils";

const AssetTableView = ({
  rootAssets,
  variant,
}: {
  rootAssets?: Asset[];
  variant: AssetVariants;
}) => {
  if (rootAssets === undefined || rootAssets.length === 0) {
    return <></>;
  }

  const data = convertAssetToTableData(rootAssets, variant);

  return (
    <div>
      <Table>
        <TableCaption className="text-base">
          Export Liste:{" "}
          {variant === "infrastructure" ? "IT-Komponenten" : "ÏTSM-Maßnahmen"}
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-contrast-semidark *:text-tc-contrast text-base hover:bg-contrast-dark">
            <TableHead>{data[0][0] || ""}</TableHead>
            <TableHead>{data[0][1] || ""}</TableHead>
            <TableHead>{data[0][2] || ""}</TableHead>
            <TableHead>{data[0][3] || ""}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-base">
          <AssetTableViewRow data={data.slice(1)} />
        </TableBody>
      </Table>
    </div>
  );
};

export default AssetTableView;
