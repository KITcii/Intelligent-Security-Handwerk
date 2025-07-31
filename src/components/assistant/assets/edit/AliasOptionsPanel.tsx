import { Asset, AssetInstance, ComponentAlias } from "@/types/assistant";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import RenameAliasForm from "./RenameAliasForm";
import AddTagForm from "./AddTagForm";
import DeleteTagButton from "./DeleteTagButton";
import AddTagList from "./AddTagList";
import { Badge } from "@/components/ui/badge";

const AliasOptionsPanel = ({
  asset,
  entry,
  refresh,
}: {
  asset: Asset;
  entry: ComponentAlias | undefined;
  refresh: (instance: AssetInstance | undefined) => void;
}) => {
  if (entry === undefined) {
    return <></>;
  }
  return (
    <div
      className={cn(
        "border rounded-md mt-4 p-4",
        asset.asset === undefined && "cursor-not-allowed"
      )}
    >
      <h2 className="font-semibold mb-1">
        Alias &quot;{entry.alias}&quot; bearbeiten
      </h2>
      <Separator className="mb-4" />
      <div className="flex flex-row gap-32">
        <RenameAliasForm alias={entry} refresh={refresh} />
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <div className="font-semibold">Vergebene Tags</div>
            <div className="flex flex-wrap gap-2">
              {entry.tags !== undefined && entry.tags.length > 0 ? (
                entry.tags
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((tag, index) => {
                    return (
                      <div
                        key={`tag_${index}`}
                        className="flex flex-row align-middle items-center"
                      >
                        <Badge className="group pe-0 text-base h-7 bg-tc-contrast text-highlight-50 border border-highlight-50 hover:text-tc-contrast hover:bg-highlight-50">
                          <div className="flex flex-row flex-between items-center align-middle gap-1">
                            {tag.name}
                            <DeleteTagButton
                              alias={entry}
                              tag={tag}
                              refresh={refresh}
                            />
                          </div>
                        </Badge>
                      </div>
                    );
                  })
              ) : (
                <div className="text-contrast-semidark">
                  Keine Tags vergeben
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <AddTagForm alias={entry} refresh={refresh} />
            <AddTagList alias={entry} refresh={refresh} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AliasOptionsPanel;
