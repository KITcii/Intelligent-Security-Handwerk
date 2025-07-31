"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { updatePramFromUrlQuery } from "@/lib/utils";
import { Asset } from "@/types/assistant";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const AssetBreadcrump = ({
  trace,
  staticLabel,
}: {
  trace: Asset[] | undefined;
  staticLabel?: string;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const changeParent = (id: string) => {
    router.replace(
      updatePramFromUrlQuery({
        params: searchParams ? searchParams.toString() : "",
        key: "pid",
        value: id,
      }),
      { scroll: false }
    );
  };

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-base">
        {staticLabel ? (
          <BreadcrumbItem>
            <BreadcrumbPage>{staticLabel}</BreadcrumbPage>
          </BreadcrumbItem>
        ) : (
          trace &&
          trace.map((asset, i, arr) => {
            return (
              <React.Fragment key={`breadcrumb_item_${i}`}>
                {i > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem key={asset.id}>
                  {arr.length - 1 === i ? (
                    <BreadcrumbPage>{asset.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      onClick={() => changeParent(asset.id)}
                      className="inline-link cursor-pointer"
                    >
                      {asset.name}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AssetBreadcrump;
