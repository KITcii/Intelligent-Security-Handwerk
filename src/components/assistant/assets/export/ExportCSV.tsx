import { Button } from "@/components/ui/button";
import { convertAssetToTableData } from "@/lib/assetUtils";
import { Asset, AssetVariants } from "@/types/assistant";

const ExportCSV = ({
  rootAssets,
  variant,
}: {
  rootAssets: Asset[];
  variant: AssetVariants;
}) => {
  const convertToCSV = (rows: string[][]) => {
    let str = "";
    rows.forEach((row) => {
      let line = "";
      row.forEach((cell) => {
        if (line !== "") line += ",";
        line += `"${cell.replace(/"/g, '""')}"`;
      });
      str += line + "\r\n";
    });
    return str;
  };

  const downloadCSV = () => {
    const data = convertAssetToTableData(rootAssets, variant);
    const csvData = new Blob([convertToCSV(data)], {
      type: "text/csv;charset=UTF-8",
    });
    const csvURL = URL.createObjectURL(csvData);
    const link = document.createElement("a");
    link.href = csvURL;
    link.download = `export_${variant === "infrastructure" ? "komponenten" : "massnahmen"}_[${Date.now()}].csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <Button onClick={downloadCSV} className="button">
      <i className="material-symbols-outlined bold me-2">download</i> CSV
      exportieren
    </Button>
  );
};

export default ExportCSV;
