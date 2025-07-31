"use client";
import ProgressBar from "@/components/shared/ProgressBar";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import {
  MeasureStatusLabelValues,
  MeasureStatusValues,
} from "@/constants/assistant";
import { getAllAliases, getAllTags } from "@/lib/api/assets.api";
import { cn, formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { AssetFacet } from "@/types/assistant";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

const ListFacetFilter = ({
  selected,
  variant,
  className,
}: {
  selected?: AssetFacet[];
  variant: "alias" | "tag" | "state";
  className?: string;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [allFacets, setAllFacets] = useState<AssetFacet[] | undefined>(
    undefined
  );
  const [selectedFacets, setSelectedFacets] = useState<
    AssetFacet[] | undefined
  >(selected);

  useEffect(() => {
    const key =
      variant === "tag"
        ? "tags"
        : variant === "alias"
          ? "aliases"
          : variant === "state"
            ? "states"
            : "filter";

    let newUrl = "";
    if (selectedFacets) {
      newUrl = formUrlQuery({
        params: searchParams?.toString() || "",
        data: [
          { key: key, value: selectedFacets?.map((f) => f.name).join(",") },
        ],
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams?.toString() || "",
        keysToRemove: [key],
      });
    }
    router.replace(newUrl, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, selectedFacets, variant]);

  useEffect(() => {
    if (open) {
      if (variant === "tag") {
        startTransition(() =>
          getAllTags()
            .then((tags) => {
              if (tags) {
                setAllFacets(
                  tags.map((tag) => {
                    return { id: tag.id, name: tag.name };
                  })
                );
              }
            })
            .catch(() => {})
        );
      } else if (variant === "alias") {
        startTransition(() =>
          getAllAliases()
            .then((aliases) => {
              if (aliases) {
                setAllFacets(
                  aliases.map((alias) => {
                    return { id: alias.id, name: alias.name };
                  })
                );
              }
            })
            .catch(() => {})
        );
      } else if (variant === "state") {
        setAllFacets(
          MeasureStatusValues.map((status) => {
            return { id: status, name: status };
          })
        );
      }
    }
  }, [open, variant]);

  const handleSelect = (selectedFacetId: string) => {
    if (selectedFacets?.some((facet) => facet.id == selectedFacetId)) {
      setSelectedFacets(
        selectedFacets.filter((facet) => facet.id != selectedFacetId)
      );
    } else {
      const newFacet = allFacets?.find((facet) => facet.id == selectedFacetId);
      if (newFacet) {
        setSelectedFacets([...(selectedFacets || []), newFacet]);
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "text-base justify-between bg-contrast-light",
            variant === "tag" ? "w-52" : variant === "alias" ? "w-72" : "w-56",
            className
          )}
        >
          <div className="flex flex-row flex-between w-full">
            <div className="flex flex-row items-center align-middle">
              <i
                className={cn(
                  "material-symbols-outlined me-1",
                  variant === "tag"
                    ? "md-s"
                    : variant === "alias"
                      ? "md-m"
                      : variant === "state"
                        ? "md-m"
                        : "md-s"
                )}
              >
                {variant === "tag"
                  ? "sell"
                  : variant === "alias"
                    ? "devices"
                    : variant === "state"
                      ? "check_circle"
                      : "filter_alt"}
              </i>
              {variant === "tag"
                ? "Tags"
                : variant === "alias"
                  ? "Alias-Namen"
                  : variant === "state"
                    ? "Status"
                    : "Filter"}
            </div>
            <div className="flex flex-row items-center align-middle">
              <Badge className="me-2 text-sm">
                {selectedFacets && selectedFacets.length > 0
                  ? selectedFacets.length
                  : "alle"}
              </Badge>
              <i className="material-symbols-outlined md-s">
                keyboard_arrow_down
              </i>
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[360px] p-4 ">
        <Command>
          <CommandInput
            placeholder={`${variant === "tag" ? "Tags" : variant === "alias" ? "Alias-Namen" : "Filter"} durchsuchen...`}
            className="h-12 text-base"
          />
          <CommandList>
            {isPending ? (
              <div className="flex flex-row items-center gap-3 p-4">
                <ProgressBar
                  progress={50}
                  spinner={true}
                  style="bold"
                  className="w-6"
                />
                <span>
                  Lade{" "}
                  {variant === "tag"
                    ? "Tag"
                    : variant === "alias"
                      ? "Alias-Namen"
                      : variant === "state"
                        ? "Status"
                        : "Filter"}
                  ...
                </span>
              </div>
            ) : (
              <>
                <CommandEmpty>
                  <span className="text-base">
                    Keine{" "}
                    {variant === "tag"
                      ? "Tags"
                      : variant === "alias"
                        ? "Alias-Namen"
                        : "Filter"}{" "}
                    gefunden
                  </span>
                </CommandEmpty>
                {allFacets && (
                  <CommandGroup>
                    <>
                      {selectedFacets &&
                        selectedFacets.map((facet, index) => (
                          <CommandItem
                            key={`${variant}_selected_facet_${index}_${facet.id}`}
                            value={facet.id}
                            className="hover:bg-contrast-light font-semibold text-base py-2 ps-4 border-b-2 border-tc-contrast rounded-sm bg-contrast-verylight cursor-pointer h-10"
                            onSelect={() => handleSelect(facet.id)}
                          >
                            <i className="material-symbols-outlined md-s bold text-highlight-100 w-8">
                              check
                            </i>
                            <div className="flex flex-between w-full">
                              <div className="w-fit pe-6 overflow-hidden text-wrap break-all leading-tight">
                                {variant === "state"
                                  ? MeasureStatusLabelValues.find(
                                      (s) => s.id === facet.id
                                    )?.name
                                  : facet.name}
                              </div>
                              {facet.count && (
                                <div className="bg-contrast-neutral text-contrast-semidark rounded-full w-6 aspect-square flex justify-center align-middle text-sm leading-relaxed">
                                  {facet.count}
                                </div>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      {selectedFacets && selectedFacets.length > 0 && (
                        <Separator className="mt-1" />
                      )}
                      {allFacets.map((facet, index) => {
                        if (!selectedFacets?.some((f) => f.id == facet.id)) {
                          return (
                            <CommandItem
                              key={`${variant}_undelected_facet_${index}_${facet.id}`}
                              value={facet.id}
                              className="group hover:bg-contrast-light hover:font-semibold text-base py-2 pe-4 ps-12 rounded-sm cursor-pointer min-h-10"
                              onSelect={() => handleSelect(facet.id)}
                            >
                              <div className="flex flex-between w-full">
                                <div className="w-fit pe-6 overflow-hidden text-wrap break-all leading-tight">
                                  {variant === "state"
                                    ? MeasureStatusLabelValues.find(
                                        (s) => s.id === facet.id
                                      )?.name
                                    : facet.name}
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 text-sm text-contrast-dark">
                                  {variant === "tag"
                                    ? "Tag"
                                    : variant === "alias"
                                      ? "Namen"
                                      : variant === "state"
                                        ? "Status"
                                        : "Filter"}{" "}
                                  hinzufügen
                                </div>
                                {facet.count && (
                                  <div className="bg-contrast-neutral text-contrast-semidark rounded-full w-6 aspect-square flex justify-center align-middle text-sm leading-relaxed">
                                    {facet.count}
                                  </div>
                                )}
                              </div>
                            </CommandItem>
                          );
                        }
                        return <></>;
                      })}
                    </>
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
        <div className="mt-2 w-full flex flex-row">
          <Button
            className="button button-subtle grow"
            disabled={!selectedFacets || selectedFacets.length === 0}
            aria-disabled={!selectedFacets || selectedFacets.length === 0}
            onClick={() => {
              setSelectedFacets(undefined);
              setOpen(false);
            }}
          >
            Filter zurücksetzen
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ListFacetFilter;
