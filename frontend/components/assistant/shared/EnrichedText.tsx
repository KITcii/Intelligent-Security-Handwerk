import { GlossaryEntryLight } from "@/types/assistant";
import React from "react";
import TermTooltip from "./TermTooltip";

const EnrichedText = ({
  text,
  references,
}: {
  text: string;
  references: GlossaryEntryLight[];
}) => {
  const result: [string, GlossaryEntryLight | null][] = [];

  // Sort phrases by length of text in descending order
  references.sort((a, b) => b.keyword.length - a.keyword.length);

  let currentIndex = 0;

  while (currentIndex < text.length) {
    let matchFound = false;

    for (const reference of references) {
      if (text.startsWith(reference.keyword, currentIndex)) {
        result.push([reference.keyword, reference]);
        currentIndex += reference.keyword.length;
        matchFound = true;
        break;
      }
    }

    if (!matchFound) {
      const nextBreak = currentIndex + 1;
      result.push([text[currentIndex], null]);
      currentIndex = nextBreak;
    }
  }

  // Aggregate consecutive tuples with no matching phrase
  const aggregatedResult: [string, GlossaryEntryLight | null][] = [];
  let buffer = "";

  for (const [chunk, id] of result) {
    if (id === null) {
      buffer += chunk;
    } else {
      if (buffer) {
        aggregatedResult.push([buffer, null]);
        buffer = "";
      }
      aggregatedResult.push([chunk, id]);
    }
  }

  if (buffer) {
    aggregatedResult.push([buffer, null]);
  }

  if (aggregatedResult.length === 0) {
    return <div>{text}</div>;
  }

  return (
    <div className="whitespace-pre-wrap">
      {aggregatedResult.map(([string, entry], index) => {
        if (entry === null) {
          return (
            <React.Fragment key={`text_snippet_${index}`}>
              {string}
            </React.Fragment>
          );
        } else {
          return (
            <TermTooltip
              key={`text_snippet_${index}`}
              term={string}
              entry={entry}
            />
          );
        }
      })}
    </div>
  );
};

export default EnrichedText;
