"use client";

import { Button } from "@/components/ui/button";
import { SupportTopic } from "@/types/assistant";
import Link from "next/link";
import { useState } from "react";

const SupportTopicsList = ({ topics }: { topics: SupportTopic[] }) => {
  const [showAll, setShowAll] = useState(false);
  const MAX_DISPLAY = 10;
  return (
    <>
      <h3 className="font-bold mb-2">Wissensthemen</h3>
      {topics.length > 0 ? (
        <ul className="ms-5 hyphens-auto">
          {topics.map((entry, index) => {
            if (!showAll && index >= MAX_DISPLAY) return null;
            return (
              <li key={`topics_${index}`} className="list-disc">
                <Link
                  href={`/assistant/glossary/details/entry/${entry.id}`}
                  className="inline-link"
                >
                  {entry.name}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <span className="italic">Keine passenden Themen vorhanden</span>
      )}
      {topics.length > MAX_DISPLAY && (
        <Button
          variant={"link"}
          onClick={() => setShowAll((value) => !value)}
          className="m-0 p-0 inline-link text-base text-inherit"
        >
          {showAll ? "› Weniger anzeigen" : "› Alle anzeigen"}
        </Button>
      )}
    </>
  );
};

export default SupportTopicsList;
