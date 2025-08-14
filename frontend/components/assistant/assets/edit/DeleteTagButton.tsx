import ProgressBar from "@/components/shared/ProgressBar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { removeAliasTag } from "@/lib/actions/assets.action";
import {
  AssetInstance,
  ComponentAlias,
  ComponentAliasTag,
} from "@/types/assistant";
import { useTransition } from "react";
import { toast } from "sonner";

const DeleteTagButton = ({
  alias,
  tag,
  refresh,
}: {
  alias: ComponentAlias;
  tag: ComponentAliasTag;
  refresh: (instance: AssetInstance | undefined) => void;
}) => {
  const [isPending, startTransition] = useTransition();

  const handleDeleteTag = () => {
    startTransition(() =>
      removeAliasTag(alias.instanceId, tag.name)
        .then((res) => {
          if (res.success) {
            toast.success(res.message);
            refresh((res.payload as AssetInstance) || undefined);
          } else {
            toast.error(res.message);
          }
        })
        .catch(() => {})
    );
  };

  return (
    <Button
      size={"icon"}
      variant={"link"}
      className="hover:no-underline"
      onClick={handleDeleteTag}
      disabled={isPending}
    >
      {isPending ? (
        <ProgressBar
          progress={50}
          spinner={true}
          style="bold"
          className="w-6"
        />
      ) : (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <i className="material-symbols-outlined md-m fillhover group-hover:text-danger-high hover:text-danger-high text-highlight-50">
                delete
              </i>
            </TooltipTrigger>
            <TooltipContent className="text-base">Tag löschen</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </Button>
  );
};

export default DeleteTagButton;
