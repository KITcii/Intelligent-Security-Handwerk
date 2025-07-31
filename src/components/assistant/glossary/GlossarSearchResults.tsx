"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import BackgroundPanel from "../shared/BackgroundPanel";
import {
  cn,
  formUrlQuery,
  getVisiblePageNumbers,
  removeKeysFromQuery,
} from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { GlossarySearchResult } from "@/types/assistant";

const GlossarSearchResults = ({
  searchResults,
}: {
  searchResults: GlossarySearchResult;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [page, setPage] = useState(1);

  useEffect(() => {
    let newUrl = "";
    if (page) {
      newUrl = formUrlQuery({
        params: searchParams?.toString() || "",
        data: [{ key: "page", value: page.toString() }],
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams?.toString() || "",
        keysToRemove: ["page"],
      });
    }
    router.push(newUrl, { scroll: false });
  }, [page, searchParams, router]);

  const totalPages = searchResults.totalPages || 1;

  return (
    <div>
      <BackgroundPanel className="max-w-[800px]">
        <h1 className="text-lg font-bold mb-4">
          Gefundene Einträge ({searchResults.totalElements || 0})
        </h1>
        <div className="mb-6">
          <ul>
            {searchResults.content?.map((entry, index) => {
              return (
                <li key={`result_${searchResults.number}_${index}_${entry.id}`}>
                  <Link
                    href={`/assistant/glossary/details/entry/${entry.id}`}
                    className="inline-link"
                  >
                    {entry.keyword.replace(/\\"/g, '"')}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationLink
                  aria-label="Zur vorherigen Seite"
                  size="default"
                  className={cn("gap-1 pl-2.5")}
                  onClick={() => setPage(Math.max(page - 1, 1))}
                  href="#"
                >
                  <i className="material-symbols-outlined md-xs">
                    arrow_back_ios
                  </i>
                  <span>Zurück</span>
                </PaginationLink>
              </PaginationItem>
              {getVisiblePageNumbers(
                searchResults.totalPages || 1,
                searchResults.number || 1,
                7
              ).map((p) => {
                return (
                  <PaginationItem
                    key={`pagination_item_${p}`}
                    className={cn(
                      p === searchResults.number &&
                        "bg-contrast-light rounded-md"
                    )}
                  >
                    <PaginationLink href="#" onClick={() => setPage(p)}>
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationLink
                  aria-label="Zur nächsten Seite"
                  size="default"
                  className={cn("gap-1 pl-2.5")}
                  onClick={() => setPage(Math.min(page + 1, totalPages))}
                  href="#"
                >
                  <span>Vorwärts</span>
                  <i className="material-symbols-outlined md-xs">
                    arrow_forward_ios
                  </i>
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </BackgroundPanel>
    </div>
  );
};

export default GlossarSearchResults;
