"use client";

import AssetTile from "@/components/assistant/assets/AssetTile";
import { updatePramFromUrlQuery } from "@/lib/utils";
import { Asset, AssetVariants } from "@/types/assistant";
import { useRouter, useSearchParams } from "next/navigation";

const AssetTileList = ({
  assets,
  parent,
  altTitle,
  variant,
}: {
  assets: Asset[];
  parent?: Asset;
  altTitle?: string;
  variant: AssetVariants;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const changeParent = (id: string) => {
    router.push(
      updatePramFromUrlQuery({
        params: searchParams?.toString() || "",
        key: "pid",
        value: id,
      }),
      { scroll: false }
    );
  };

  return (
    <section>
      {parent && (
        <div
          onClick={() => changeParent(parent?.id)}
          className="inline-link cursor-pointer"
        >
          <h2 className="mb-3 font-bold">{parent?.name}</h2>
        </div>
      )}
      {!parent && altTitle && <h2 className="mb-3 font-bold">{altTitle}</h2>}
      <div className="flex flex-wrap flex-none gap-3">
        {assets.map((asset, index) => {
          return (
            <AssetTile
              type={
                asset.children !== undefined && asset.children.length > 0
                  ? "category"
                  : "asset"
              }
              variant={variant}
              key={`list_item_${index}_asset_${asset.id}`}
              asset={asset}
              changeParent={changeParent}
            />
          );
        })}
      </div>
    </section>
  );
};

export default AssetTileList;
