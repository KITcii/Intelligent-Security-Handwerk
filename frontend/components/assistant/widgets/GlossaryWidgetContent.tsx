import Link from "next/link";
import WidgetError from "./shared/WidgetError";
import { getRandomGlossarEntry } from "@/lib/api/glossary.api";
import EnrichedText from "../shared/EnrichedText";

const GlossaryWidgetContent = async () => {
  const entry = await getRandomGlossarEntry(3);

  if (entry === undefined) {
    return <WidgetError />;
  }

  return (
    <div className="flex flex-col">
      <span className="font-bold">
        <Link
          href={`/assistant/glossary/details/entry/${entry.term.id}`}
          className="inline-link"
        >
          {entry.term.keyword}
        </Link>
      </span>
      <div className="line-clamp-[12] mt-5 db-html-content">
        {entry.term.description &&
          (entry.references ? (
            <EnrichedText
              text={entry.term.description}
              references={Object.values(entry.references)}
            />
          ) : (
            entry.term.description
          ))}
      </div>
      <Link
        href="/assistant/glossary"
        className="inline-link font-bold mt-2 text-tc-muted"
      >
        › Mehr IT-Sicherheitswissen finden Sie im Glossar
      </Link>
    </div>
  );
};

export default GlossaryWidgetContent;
