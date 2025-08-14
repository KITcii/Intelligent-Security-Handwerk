"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatDateTime } from "@/lib/utils";
import React, { useState } from "react";
import { Asset, AssetInstance } from "@/types/assistant";
import ComponentAliasTag from "./ComponentAliasTag";
import BackgroundPanel from "../../shared/BackgroundPanel";
import HoverInfoButton from "../../shared/HoverInfoButton";
import DeleteAliasButton from "./DeleteAliasButton";
import AddAliasForm from "./AddAliasForm";
import AliasOptionsPanel from "./AliasOptionsPanel";

const AliasList = ({
  asset,
  refresh,
  active = true,
}: {
  asset: Asset;
  refresh: (instance: AssetInstance | undefined) => void;
  active?: boolean;
}) => {
  const [selectedAlias, setSelectedAlias] = useState<string | undefined>(
    undefined
  );

  return (
    <BackgroundPanel
      className={cn(!active && "cursor-not-allowed")}
      aria-disabled={!active}
    >
      <div className={cn("flex flex-row flex-between max-sm:flex-col gap-2")}>
        <h2
          className={cn("font-medium sm:mb-8", !active && "text-tc-disabled")}
        >
          Alias-Namen vergeben (optional)
          <HoverInfoButton
            text={`Falls Sie mehrere konkrete Hard- oder
            Softwareprodukte vom Typ ${asset.name} besitzen, können Sie jeweils
            einen eigene Alias-Namen für die einzelen Produkte vergeben (z. B.
            Notebook-Empfang, Notebook-Außendienst-1, Notebook-Außendienst-2).
            Die Vergabe von Alias-Namen ist rein optional und dient der besseren
            Übersichtlichkeit. Die Vergabe von Alias-Namen hat keinen Einfluss
            auf die Generierung von Handlungsempfehlungen.`}
            disabled={!active}
          />
        </h2>
        <AddAliasForm asset={asset} refresh={refresh} active={active} />
      </div>
      <div className={cn("border rounded-md mt-4")}>
        <Table className="text-base">
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead className={cn(!active && "text-tc-disabled")}>
                Name
              </TableHead>
              <TableHead className={cn(!active && "text-tc-disabled")}>
                Tags
              </TableHead>
              <TableHead
                className={cn(!active && "text-tc-disabled", "min-w-32")}
              >
                Erfasst am
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {asset.asset &&
            asset.asset.aliases &&
            asset.asset.aliases.length > 0 ? (
              asset.asset.aliases.map((alias, index) => {
                return (
                  <TableRow
                    key={`alias_${alias.instanceId}_item_${index}`}
                    className={cn(
                      "cursor-pointer",
                      selectedAlias === alias.instanceId && "bg-highlight-50/10"
                    )}
                    onClick={() => setSelectedAlias(alias.instanceId)}
                  >
                    <TableCell className="pt-3 pb-1 align-top">
                      <div
                        className={cn(
                          "group w-6 aspect-square rounded-full border border-highlight-50 p-1 cursor-pointer",
                          selectedAlias === alias.instanceId && "border-2"
                        )}
                      >
                        <div
                          className={cn(
                            "w-full aspect-square rounded-full group-hover:bg-highlight-50",
                            selectedAlias === alias.instanceId &&
                              "bg-highlight-50"
                          )}
                        ></div>
                      </div>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "pt-3 pb-1 align-top",
                        selectedAlias === alias.instanceId && "font-semibold"
                      )}
                    >
                      {alias.alias}
                    </TableCell>
                    <TableCell className="pt-3 pb-1 align-top flex flex-wrap gap-1">
                      {alias.tags &&
                        alias.tags
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((tag, index) => {
                            return (
                              <ComponentAliasTag
                                name={tag.name}
                                key={`tag_${index}`}
                              />
                            );
                          })}
                    </TableCell>
                    <TableCell className="pt-3 pb-1 align-top">
                      {
                        formatDateTime(new Date(alias.createdAt || ""))
                          .dateOnlyShort
                      }
                    </TableCell>
                    <TableCell className="text-right pt-1 pb-1 align-top">
                      <DeleteAliasButton asset={asset} alias={alias} />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5}>
                  <div
                    className={cn(
                      "w-full text-center my-5",
                      !active && "text-tc-disabled"
                    )}
                  >
                    Keine Einträge vorhanden
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {selectedAlias && (
        <AliasOptionsPanel
          entry={asset?.asset?.aliases?.find(
            (e) => e.instanceId === selectedAlias
          )}
          asset={asset}
          refresh={refresh}
        />
      )}
    </BackgroundPanel>
  );
};

export default AliasList;
