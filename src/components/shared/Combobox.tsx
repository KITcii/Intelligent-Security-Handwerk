"use client";

import { cn } from "@/lib/utils";
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
import { useState } from "react";
import { FormControl } from "../ui/form";
import { Input } from "@/components/ui/input";
import ProgressBar from "./ProgressBar";

const Combobox = ({
  placeholder,
  name,
  value,
  data,
  contextWidth,
  className,
  alignment,
  allowEmpty = false,
  isPending = false,
}: {
  placeholder: string;
  name: string;
  value?: string | null;
  data:
    | {
        value: string;
        label: string;
      }[]
    | undefined;
  contextWidth?: string;
  alignment?: "start" | "end";
  allowEmpty?: boolean;
  className?: string;
  isPending?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [fieldValue, setFieldValue] = useState<string | undefined | null>(
    value
  );

  return (
    <>
      <Input
        type="hidden"
        name={name}
        value={
          fieldValue === null || fieldValue === undefined ? "" : fieldValue
        }
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl className={cn(className)}>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "w-full justify-between text-base overflow-hidden text-ellipsis"
              )}
            >
              <span className="overflow-hidden text-ellipsis">
                {data && fieldValue
                  ? data.find((item) => item.value == fieldValue)?.label
                  : allowEmpty &&
                      (fieldValue === "" ||
                        fieldValue === null ||
                        fieldValue === undefined)
                    ? "Keine Angaben"
                    : `${placeholder} auswählen...`}
              </span>
              <i className="material-symbols-outlined shrink-0 opacity-50">
                unfold_more
              </i>
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent
          align={alignment || "end"}
          className={cn(
            "w-full max-w-[400px] min-w-64 p-0",
            contextWidth && contextWidth
          )}
        >
          <Command
            shouldFilter={data ? data.length > 8 : undefined}
            filter={(value, search, keywords) => {
              let extendValue = value;
              if (keywords) extendValue += " " + keywords.join(" ");
              const pattern = new RegExp(`${search}`, "i");
              if (extendValue.search(pattern) > -1) return 1;
              return 0;
            }}
          >
            {data && data.length > 8 && (
              <CommandInput
                placeholder={`${placeholder} durchsuchen...`}
                className="h-12 text-base"
              />
            )}
            <CommandList className="p-2">
              <CommandEmpty className="text-base">
                Keine Einträge gefunden.
              </CommandEmpty>
              {isPending ? (
                <div className="flex flex-row items-center gap-3 p-4">
                  <ProgressBar
                    progress={50}
                    spinner={true}
                    style="bold"
                    className="w-6"
                  />
                  <span>Lade Einträge...</span>
                </div>
              ) : (
                <CommandGroup>
                  {allowEmpty && (
                    <CommandItem
                      key="empty_value_item"
                      value={undefined}
                      onSelect={() => {
                        setFieldValue("");
                        setOpen(false);
                      }}
                      className="text-base"
                    >
                      Keine Angabe
                      <i
                        className={cn(
                          "material-symbols-outlined md-s heavy text-highlight-100 ms-2",
                          fieldValue === "" ||
                            fieldValue === null ||
                            fieldValue === undefined
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      >
                        check
                      </i>
                    </CommandItem>
                  )}
                  {data &&
                    data.map((item) => (
                      <CommandItem
                        key={item.value}
                        value={item.value}
                        keywords={[item.label]}
                        onSelect={() => {
                          setFieldValue(item.value);
                          setOpen(false);
                        }}
                        className="text-base"
                      >
                        {item.label}
                        <i
                          className={cn(
                            "material-symbols-outlined md-s heavy text-highlight-100 ms-2",
                            fieldValue == item.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        >
                          check
                        </i>
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default Combobox;
