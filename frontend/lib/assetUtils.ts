import {
  Asset,
  AssetInstance,
  AssetVariants,
  MeasureDisplayStatus,
} from "@/types/assistant";

export function convertAssetToTableData(
  rootAssets: Asset[],
  variant: AssetVariants
): string[][] {
  const data: string[][] = [
    [
      "#",
      "Name",
      "Beschreibung",
      variant === "infrastructure" ? "Alias-Namen" : "Status Umsetzung",
    ],
  ];
  const processAsset = (prefix: string, assets?: Asset[]) => {
    if (assets === undefined || assets.length === 0) return;

    assets.forEach((asset, index) => {
      const indexString = `${prefix}${prefix.length > 0 ? "." : ""}${
        index + 1
      }`;
      if (asset.children !== undefined && asset.children.length > 0) {
        data.push([
          indexString,
          asset.name,
          "",
          variant === "infrastructure" ? "" : "–",
        ]);
        processAsset(indexString, asset.children);
      } else {
        data.push([
          indexString,
          asset.name,
          (variant === "infrastructure"
            ? asset.description
            : asset.description) || "",
          (variant === "infrastructure"
            ? asset.asset?.aliases
              ? asset.asset.aliases.map((alias) => alias.alias).join("; ")
              : ""
            : asset.asset !== undefined
              ? measureDisplayStatusToText(
                  determineMeasureDisplayStatus(asset.asset),
                  asset
                )
              : "Kein Status") || "",
        ]);
      }
    });
  };
  processAsset("", rootAssets);
  return data;
}

export async function extractSubtreeByIdWithTrace(
  assets: Asset[] | undefined,
  id: string,
  trace?: Asset[]
): Promise<{ asset: Asset | undefined; trace: Asset[] | undefined }> {
  if (assets !== undefined && assets.length > 0) {
    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      if (asset["id"] == id) {
        const newTrace: Asset[] =
          trace !== undefined ? [asset, ...trace] : [asset];
        return { asset: asset, trace: newTrace };
      }
      const result = await extractSubtreeByIdWithTrace(asset.children, id);
      if (result.asset !== undefined && result.trace !== undefined) {
        const newTrace: Asset[] =
          result.trace !== undefined ? [asset, ...result.trace] : [asset];

        return { asset: result.asset, trace: newTrace };
      }
    }
  }
  // Object not found with the specified property value
  return { asset: undefined, trace: undefined };
}

//find a specific asset within the asset tree structure and return it and its children
export function findAssetById(
  assets: Asset[] | undefined,
  id: string
): Asset | undefined {
  if (assets !== undefined && assets.length > 0) {
    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      if (asset["id"] == id) {
        return asset;
      }
      const result = findAssetById(asset.children, id);
      if (result !== undefined) {
        return result;
      }
    }
  }
  // Object not found with the specified property value
  return undefined;
}

// counts all selected children of an asset
export const countSelectedChildren = (a: Asset) => {
  let counter = 0;
  if (a.children !== undefined && a.children.length > 0) {
    for (let i = 0; i < a.children.length; i++) {
      counter += countSelectedChildren(a.children[i]);
    }
  } else if (a.asset !== undefined) {
    counter++;
  }
  return counter;
};

export const determineMeasureDisplayStatus = (
  asset: AssetInstance | undefined
): MeasureDisplayStatus => {
  if (!asset) return "DEFAULT";
  switch (asset.status) {
    case "IMPLEMENTED":
      return "IMPLEMENTED";
    case "IN_PROCESS":
      return "IN_PROCESS";
    case "IRRELEVANT":
      return "IRRELEVANT";
    case "OPEN":
      // this should currently allways return RECOMMENDED, as OPEN state only occurs for unselected but recommended measures
      return asset.recommended ? "RECOMMENDED" : "DEFAULT";
    default:
      return "DEFAULT";
  }
};

export const measureDisplayStatusToText = (
  status: MeasureDisplayStatus,
  asset: Asset | undefined
): string => {
  switch (status) {
    case "IMPLEMENTED":
      return "Umgesetzt";
    case "IN_PROCESS":
      return `In Bearbeitung ${asset && asset.asset && asset.guidelines ? `${Math.round(((asset.asset.implementedGuidelines?.length || 0) / asset?.guidelines?.length) * 100)}%)` : ""}`;
    case "RECOMMENDED":
      return "Empfohlen";
    case "IRRELEVANT":
      return "Nicht relevant";
    default:
      return "Unbekannt";
  }
};

// counts the different statuses of all children of an asset of type measure
export const collectChildrenStatus = (
  a: Asset
):
  | {
      [key: MeasureDisplayStatus]: number;
    }
  | undefined => {
  const counter: {
    [key: MeasureDisplayStatus]: number;
  } = {
    IMPLEMENTED: 0,
    IN_PROCESS: 0,
    RECOMMENDED: 0,
    IRRELEVANT: 0,
    DEFAULT: 0,
  };
  if (a.children !== undefined && a.children.length > 0) {
    for (let i = 0; i < a.children.length; i++) {
      const result = collectChildrenStatus(a.children[i]);
      if (result !== undefined) {
        counter.IMPLEMENTED += result.IMPLEMENTED;
        counter.IN_PROCESS += result.IN_PROCESS;
        counter.RECOMMENDED += result.RECOMMENDED;
        counter.IRRELEVANT += result.IRRELEVANT;
      }
    }
  } else if (a.asset !== undefined) {
    counter[determineMeasureDisplayStatus(a.asset)]++;
  }
  return counter;
};

// check if an asset has at least one selected child
export const hasSelectedChildren = (a: Asset): boolean => {
  if (a.children !== undefined && a.children.length > 0) {
    for (let i = 0; i < a.children.length; i++) {
      if (hasSelectedChildren(a.children[i])) {
        return true;
      } else if (a.children[i].asset !== undefined) {
        return true;
      }
    }
  }
  return false;
};

export const countChildren = (a: Asset): number => {
  if (a.children !== undefined && a.children.length > 0) {
    return a.children.length;
  }
  return 0;
};
