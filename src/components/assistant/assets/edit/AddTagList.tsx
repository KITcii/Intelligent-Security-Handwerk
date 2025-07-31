"use client";

import ProgressBar from "@/components/shared/ProgressBar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createOrAddAliasTag } from "@/lib/actions/assets.action";
import { getAllTags } from "@/lib/api/assets.api";
import {
  AssetInstance,
  ComponentAlias,
  ComponentAliasTag,
} from "@/types/assistant";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

const AddTagList = ({
  alias,
  refresh,
}: {
  alias: ComponentAlias;
  refresh: (instance: AssetInstance | undefined) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [allTags, setAllTags] = useState<ComponentAliasTag[] | undefined>(
    undefined
  );
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchData = async () => {
      return await getAllTags();
    };

    if (open) {
      startTransition(() =>
        fetchData()
          .then((tags) => {
            setAllTags(tags);
          })
          .catch(() => {})
      );
    }
  }, [open]);

  const handleClick = (tag: string) => {
    const req = new FormData();
    req.append("instanceId", alias.instanceId);
    req.append("tag", tag);
    createOrAddAliasTag({}, req)
      .then((res) => {
        if (res.success) {
          toast.success(res.message);
          refresh((res.payload as AssetInstance) || undefined);
        } else {
          toast.error(res.message);
        }
      })
      .catch(() => {
        toast.error("Tag konnte nicht hinzugefügt werden.");
      });
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="text-base w-[360px] justify-between bg-contrast-light"
        >
          <div className="flex flex-row items-center align-middle">
            <i className="material-symbols-outlined md-s me-1 bold">add</i>
            Aus bestehenden Tag auswählen
          </div>
          <i className="material-symbols-outlined md-s">unfold_more</i>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[360px] p-4 ">
        <div className="font-semibold mb-2">
          Aus existierenden Tags auswählen
        </div>
        {isPending ? (
          <div className="flex flex-row items-center gap-3 p-4">
            <ProgressBar
              progress={50}
              spinner={true}
              style="bold"
              className="w-6"
            />
            <span>Lade Tags...</span>
          </div>
        ) : (
          <Command>
            <CommandInput
              placeholder="Tags durchsuchen..."
              className="h-12 text-base"
            />
            <CommandList>
              <CommandEmpty className="text-base text-center p-4">
                Keine Tags gefunden
              </CommandEmpty>
              <CommandGroup>
                {allTags &&
                  allTags.map((tag, index) => {
                    if (!alias.tags?.some((t) => t.id === tag.id)) {
                      return (
                        <CommandItem
                          key={`tag_list_${index}_${tag.id}`}
                          value={tag.name}
                          className="group hover:bg-contrast-light text-base py-2 px-4 me-3 rounded-sm flex flex-between cursor-pointer"
                          onSelect={(currentValue) => {
                            handleClick(currentValue);
                            setOpen(false);
                          }}
                        >
                          {tag.name}
                          <div className="opacity-0 group-hover:opacity-100 text-sm text-contrast-dark">
                            Tag hinzufügen
                          </div>
                        </CommandItem>
                      );
                    } else {
                      return (
                        <CommandItem
                          key={`tag_list_${index}_${tag.id}`}
                          value={tag.name}
                          className="group bg-contrast-verylight text-base py-2 px-4 me-3 rounded-sm flex flex-between text-tc-muted"
                        >
                          {tag.name}
                          <i className="material-symbols-outlined md-s filled text text-highlight-100">
                            check
                          </i>
                        </CommandItem>
                      );
                    }
                  })}
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default AddTagList;
