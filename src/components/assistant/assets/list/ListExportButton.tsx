import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Asset, AssetVariants } from "@/types/assistant";
import React from "react";
import AssetTableView from "../AssetTableView";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ExportCSV from "../export/ExportCSV";
import ExportPDF from "../export/ExportPDF";

const ListExportButton = ({
  rootAssets,
  variant,
  className,
}: {
  rootAssets?: Asset[];
  variant: AssetVariants;
  className?: string;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={cn("button", className)}>
          <i className="material-symbols-outlined me-2">download</i> Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>
            Export Liste:{" "}
            {variant === "infrastructure" ? "IT-Komponenten" : "ITSM-Maßnahmen"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {rootAssets && rootAssets.length > 0 ? (
          <div className="space-y-4">
            <div className="flex flex-row gap-4">
              <ExportCSV rootAssets={rootAssets} variant={variant} />
              <ExportPDF rootAssets={rootAssets} variant={variant} />
            </div>
            <ScrollArea
              type="always"
              className="h-[600px] w-full rounded-md border p-4"
            >
              <AssetTableView rootAssets={rootAssets} variant={variant} />
              <ScrollBar orientation="horizontal" />
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </div>
        ) : (
          <div>
            Keine{" "}
            {variant === "infrastructure" ? "IT-Komponenten" : "ITSM-Maßnahmen"}{" "}
            verfügbar
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ListExportButton;
