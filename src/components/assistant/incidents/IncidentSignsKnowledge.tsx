"use client";

import { Button } from "@/components/ui/button";
import { GlossaryEntryLight } from "@/types/assistant";
import Link from "next/link";
import React, { useState } from "react";

const IncidentSignsKnowledge = ({
  topics,
}: {
  topics: GlossaryEntryLight[] | undefined;
}) => {
  const [showAll, setShowAll] = useState(false);
  const MAX_DISPLAY = 5;

  if (topics === undefined || topics.length === 0) {
    return <></>;
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-row items-center align-middle">
        <i className="material-symbols-outlined md-lg me-2">developer_guide</i>
        <h3 className="text-lg font-semibold">
          Verwandte Glossarthemen: Angriffstypen
        </h3>
      </div>
      <div className="ms-10 space-y-2">
        <ul className="list-inside ms-4">
          {topics.map((entry, index) => {
            if (!showAll && index >= MAX_DISPLAY) return null;
            return (
              <li className="list-disc" key={entry.id}>
                <Link
                  href={`/assistant/glossary/details/entry/${entry.id}`}
                  className="inline-link"
                >
                  {entry.keyword}
                </Link>
              </li>
            );
          })}
        </ul>
        {topics.length > MAX_DISPLAY && (
          <Button
            variant={"link"}
            onClick={() => setShowAll((value) => !value)}
            className="m-0 p-0 inline-link text-base text-inherit"
          >
            {showAll ? "› Weniger anzeigen" : "› Alle anzeigen"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default IncidentSignsKnowledge;
