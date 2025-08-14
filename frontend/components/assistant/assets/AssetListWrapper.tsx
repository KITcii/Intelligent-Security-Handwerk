"use client";

import { extractSubtreeByIdWithTrace } from "@/lib/assetUtils";
import { Asset, AssetListViews, AssetVariants } from "@/types/assistant";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import AssetTileView from "./AssetTileView";
import { findAssetByParameters, getAssetById } from "@/lib/api/assets.api";
import AssetTreeView from "./AssetTreeView";
import { areArraysEqual, formUrlQuery } from "@/lib/utils";

const AssetListWrapper = ({
  assetTree,
  variant,
}: {
  assetTree: Asset;
  variant: AssetVariants;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  //--------------------------------------------------------------------------------
  // states
  //--------------------------------------------------------------------------------
  // data states
  const [currentAssets, setCurrentAssets] = useState<Asset[] | undefined>(
    assetTree.children
  );
  const [pathToRoot, setPathToRoot] = useState<Asset[] | undefined>([
    assetTree,
  ]);
  // filter states
  const [parentId, setParentId] = useState<string | null>(null);
  const [query, setQuery] = useState<string | null>(null);
  const [selectedOnly, setSelectedOnly] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedAliases, setSelectedAliases] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  // view states
  const [view, setView] = useState<AssetListViews | null>(
    searchParams?.get("view") as AssetListViews | null
  );
  const [searchMode, setSearchMode] = useState<boolean>(false);
  //--------------------------------------------------------------------------------

  //--------------------------------------------------------------------------------
  // helper functions
  //--------------------------------------------------------------------------------
  const resetState = () => {
    setCurrentAssets(assetTree.children);
    setPathToRoot([assetTree]);
    setSearchMode(false);
  };
  //--------------------------------------------------------------------------------

  useEffect(() => {
    // get asset id from url directly
    const aid = searchParams?.get("aid");
    const pid = searchParams?.get("pid");
    if (aid !== null && aid !== "" && pid === null) {
      startTransition(() =>
        getAssetById({ id: aid, variant: variant })
          .then((data) => {
            const newParentId = data?.parent;
            if (newParentId) {
              router.replace(
                formUrlQuery({
                  params: searchParams?.toString() || "",
                  data: [{ key: "pid", value: newParentId }],
                })
              );
            } else {
              notFound();
            }
          })
          .catch(() => {
            notFound();
          })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    //--------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------
    // filter assets
    if (
      query !== searchParams?.get("query") ||
      selectedOnly != (searchParams?.get("selected") === "true") ||
      !areArraysEqual(selectedTags, searchParams?.getAll("tags")) ||
      !areArraysEqual(selectedAliases, searchParams?.getAll("aliases")) ||
      !areArraysEqual(selectedStates, searchParams?.getAll("states"))
    ) {
      // new states
      const currentQuery = searchParams?.get("query");
      const selectedOnly = searchParams?.get("selected");
      const currentSelectedTags = searchParams?.getAll("tags");
      const currentSelectedAliases = searchParams?.getAll("aliases");
      const currentSelectedStates = searchParams?.getAll("states");

      // reset filters and search mode if request is empty
      if (
        currentQuery === null &&
        selectedOnly !== "true" &&
        (currentSelectedTags === undefined ||
          currentSelectedTags.length === 0 ||
          (currentSelectedTags.length === 1 &&
            currentSelectedTags[0] === "")) &&
        (currentSelectedAliases === undefined ||
          currentSelectedAliases.length === 0 ||
          (currentSelectedAliases.length === 1 &&
            currentSelectedAliases[0] === "")) &&
        (currentSelectedStates === undefined ||
          currentSelectedStates.length === 0 ||
          (currentSelectedStates.length === 1 &&
            currentSelectedStates[0] === ""))
      ) {
        resetState();
      } else {
        // filter assets
        startTransition(() =>
          findAssetByParameters(variant, {
            query: currentQuery || undefined,
            selectedOnly: selectedOnly === "true",
            tags: currentSelectedTags || undefined,
            aliases: currentSelectedAliases || undefined,
            states: currentSelectedStates || undefined,
          })
            .then((data) => {
              setSearchMode(true);
              if (data !== undefined) {
                setCurrentAssets(data.content);
              } else {
                setCurrentAssets([]);
              }
            })
            .catch(() => {})
        );
      }
    } else if (parentId !== searchParams.get("pid")) {
      const currentPid = searchParams.get("pid");
      // update state
      setSearchMode(false);
      if (currentPid !== null) {
        // extract subtree with trace
        startTransition(() =>
          extractSubtreeByIdWithTrace([assetTree], currentPid)
            .then((data) => {
              if (
                data !== undefined &&
                data.asset !== undefined &&
                data.trace !== undefined
              ) {
                // update state
                setCurrentAssets(data.asset.children);
                setPathToRoot(data.trace);
              } else {
                // throw error if asset with given pid was not found
                notFound();
              }
            })
            .catch(() => {
              // catch any kind of error (asset not found or server error)
              notFound();
            })
        );
      } else {
        // reset state
        resetState();
      }
      // here: remove all search params that filter out parent nodes, except view related params and pid
      // this is necessary to correctly display the requested parent node
      // currently, no such filter is implemented
    }

    // update states
    setParentId(searchParams?.get("pid") || null);
    setQuery(searchParams?.get("query") || null);
    setSelectedOnly(searchParams?.get("selected") === "true");
    setSelectedTags(searchParams?.getAll("tags") || []);
    setSelectedAliases(searchParams?.getAll("aliases") || []);
    setSelectedStates(searchParams?.getAll("states") || []);

    // update representation
    if (searchParams?.get("view") !== view) {
      setView(searchParams?.get("view") as AssetListViews);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (searchParams?.get("view") === "tree") {
    return (
      <AssetTreeView
        assetTree={assetTree}
        variant={variant}
        filteredAssets={currentAssets}
        searchMode={searchMode}
        loading={isPending}
      />
    );
  } else {
    return (
      <AssetTileView
        assetTree={assetTree}
        variant={variant}
        filteredAssets={currentAssets}
        path={pathToRoot}
        searchMode={searchMode}
        loading={isPending}
      />
    );
  }
};

export default AssetListWrapper;
