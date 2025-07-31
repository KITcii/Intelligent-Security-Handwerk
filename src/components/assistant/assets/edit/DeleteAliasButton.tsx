"use client";

import ProgressBar from "@/components/shared/ProgressBar";
import { Button } from "@/components/ui/button";
import { deleteAlias } from "@/lib/actions/assets.action";
import { Asset, ComponentAlias } from "@/types/assistant";
import { useTransition } from "react";
import { toast } from "sonner";

const DeleteAliasButton = ({
  asset,
  alias,
}: {
  asset: Asset;
  alias: ComponentAlias;
}) => {
  const [isPending, startTransition] = useTransition();
  const handleDeleteAlias = (alias: string) => {
    const callAction = async () => {
      const response = await deleteAlias(asset.id, alias);
      return response;
    };

    startTransition(() =>
      callAction()
        .then((res) => {
          if (res.success && asset.asset) {
            asset.asset.aliases = asset.asset?.aliases?.filter(
              (a) => a.alias !== alias
            );
            toast.success(res.message);
          } else {
            toast.error(res.message);
          }
        })
        .catch(() => {})
    );
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={isPending}
      className=""
      onClick={() => {
        handleDeleteAlias(alias.alias);
      }}
    >
      {isPending ? (
        <ProgressBar
          progress={50}
          spinner={true}
          style="bold"
          className="w-6"
        />
      ) : (
        <i className="material-symbols-outlined md-m">delete</i>
      )}
    </Button>
  );
};

export default DeleteAliasButton;
