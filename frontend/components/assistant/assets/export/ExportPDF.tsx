import { Button } from "@/components/ui/button";
import { convertAssetToTableData } from "@/lib/assetUtils";
import { formatDateTime } from "@/lib/utils";
import { Asset, AssetVariants } from "@/types/assistant";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ExportPDF = ({
  rootAssets,
  variant,
}: {
  rootAssets: Asset[];
  variant: AssetVariants;
}) => {
  const generatePdf = (data: string[][]): jsPDF => {
    const addHeader = (doc: jsPDF) => {
      const pageCount = doc.getNumberOfPages();

      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(
          "Export Liste: " +
            (variant === "infrastructure"
              ? "IT-Komponenten"
              : "ITSM-Maßnahmen"),
          13,
          10
        );
        doc.text(
          "Seite " + String(i) + " von " + String(pageCount),
          doc.internal.pageSize.width / 2,
          10,
          {
            align: "center",
          }
        );
        doc.text(
          "Stand: " + String(formatDateTime(new Date()).dateTimeFull),
          doc.internal.pageSize.width - 55,
          10
        );
      }
    };
    const doc = new jsPDF("l", "mm", "a4");
    autoTable(doc, {
      head: [data[0]],
      body: data
        .slice(1)
        .map((row) =>
          row.map((cell, index) =>
            index === 3 ? cell.replace(/;\s*/g, "\n") : cell
          )
        ),
      rowPageBreak: "auto",
      columnStyles: {
        0: { fontStyle: "bold" },
        1: { cellWidth: 50 },
        2: { minCellWidth: 140 },
      },
      styles: {
        cellPadding: { top: 1, right: 3, bottom: 1, left: 3 },
        fontSize: 10,
        overflow: "linebreak",
      },
    });

    addHeader(doc);
    return doc;
  };

  const downloadPdf = () => {
    const doc = generatePdf(convertAssetToTableData(rootAssets, variant));

    const pdfData = new Blob([doc.output("blob")], {
      type: "application/pdf",
    });
    const csvURL = URL.createObjectURL(pdfData);
    const link = document.createElement("a");
    link.href = csvURL;
    link.download = `export_${variant === "infrastructure" ? "komponenten" : "massnahmen"}_[${Date.now()}].pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button onClick={downloadPdf} className="button">
      <i className="material-symbols-outlined bold me-2">picture_as_pdf</i> PDF
      exportieren
    </Button>
  );
};

export default ExportPDF;
