"use client";

import { Asset, AssetInstance } from "@/types/assistant";
import React from "react";
import GuidelineList from "./GuidelineList";
import { MeasureStatusLabelValues } from "@/constants/assistant";
import StatusDot from "../../shared/StatusDot";
import FetchingError from "../../shared/FetchingError";

const SheetContentMeasure = ({
  fullAsset,
  asset,
  refreshData,
}: {
  fullAsset?: Asset;
  asset?: AssetInstance;
  refreshData: (instance: AssetInstance | undefined) => void;
}) => {
  return (
    <div>
      {fullAsset !== undefined ? (
        <>
          {asset && (
            <div className="flex flex-row gap-4">
              <span>Aktueller Status:</span>
              {
                <StatusDot
                  label={
                    asset.recommended && asset.status === "OPEN"
                      ? "Empfohlen"
                      : MeasureStatusLabelValues.find(
                          (value) => value.id == asset.status
                        )?.name
                  }
                  style={
                    asset.status === "OPEN"
                      ? "warning"
                      : asset.status === "IN_PROCESS"
                        ? "default"
                        : asset.status === "IMPLEMENTED"
                          ? "success"
                          : "neutral"
                  }
                />
              }
            </div>
          )}
          {fullAsset.guidelines && fullAsset.guidelines.length > 0 ? (
            <div className="mt-8 pe-10">
              <GuidelineList
                guidelines={fullAsset.guidelines}
                instance={asset}
                controlId={fullAsset.id.toString()}
                refreshData={refreshData}
                variant="measure"
              />
            </div>
          ) : (
            <div className="italic mt-4">
              Diese Maßnahme umfasst keine weiteren Einzelmaßnahmen.
            </div>
          )}
        </>
      ) : (
        <div className="mt-12">
          <FetchingError />
        </div>
      )}
    </div>
  );
};

export default SheetContentMeasure;
