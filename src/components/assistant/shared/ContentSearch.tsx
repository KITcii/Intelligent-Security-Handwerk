"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ContentSearch = ({
  placeholder = "",
  variant = "xl",
  autoClear,
}: {
  placeholder?: string;
  variant?: "sm" | "xl";
  autoClear?: string;
  value?: string;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [enteredText, setEnteredText] = useState("");
  const [autoClearValue, setautoClearValue] = useState<string | null>(null);

  let query = searchParams?.get("query") || "";

  useEffect(() => {
    if (query !== null && query !== "" && enteredText === "") {
      setEnteredText(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // observe given autoClear URL parameter and clear query if the parameter changes
  useEffect(() => {
    if (
      autoClear !== undefined &&
      autoClear.length > 0 &&
      enteredText.length > 0
    ) {
      const observed =
        searchParams?.get(autoClear) !== null
          ? searchParams?.get(autoClear)
          : null;
      if (observed !== autoClearValue) {
        clearQuery();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoClear, autoClearValue, enteredText.length, searchParams]);

  const setQuery = (q: string) => {
    if (autoClear !== undefined && autoClear.length > 0) {
      // store current searchParam value of observed param
      setautoClearValue(
        searchParams && searchParams?.get(autoClear) !== null
          ? searchParams?.get(autoClear)
          : null
      );
    }
    setEnteredText(q);
    const delayDebounceFn = setTimeout(() => {
      query = q;
      let newUrl = "";
      if (query) {
        newUrl = formUrlQuery({
          params: searchParams?.toString() || "",
          data: [{ key: "query", value: query }],
        });
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams?.toString() || "",
          keysToRemove: ["query"],
        });
      }
      router.replace(newUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  };

  function clearQuery(): void {
    setQuery("");
    setEnteredText("");
  }

  return (
    <div
      className={cn(
        "relative w-full inline-block",
        (() => {
          switch (variant) {
            case "sm":
              return "max-w-[400px] min-w-[300px]";
            case "xl":
            default:
              return "max-w-[800px]";
          }
        })()
      )}
    >
      <Input
        type="text"
        className={cn(
          "rounded-full px-5 text-base bg-grey-50 pe-14",
          (() => {
            switch (variant) {
              case "sm":
                return "h-12";
              case "xl":
              default:
                return "h-14";
            }
          })()
        )}
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        value={enteredText}
      />
      {enteredText !== "" ? (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-2 right-5",
            (() => {
              switch (variant) {
                case "sm":
                  return "top-1";
                case "xl":
                default:
                  return "top-2";
              }
            })()
          )}
          onClick={() => clearQuery()}
        >
          <i className="material-symbols-outlined bold text-contrast-semidark">
            close
          </i>
        </Button>
      ) : (
        <i
          className={cn(
            "absolute right-5 material-symbols-outlined bold text-contrast-semidark",
            (() => {
              switch (variant) {
                case "sm":
                  return "top-3";
                case "xl":
                default:
                  return "top-4";
              }
            })()
          )}
        >
          search
        </i>
      )}
    </div>
  );
};

export default ContentSearch;
