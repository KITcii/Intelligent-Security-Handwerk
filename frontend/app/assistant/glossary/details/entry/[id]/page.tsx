import GlossarBreadcrump from "@/components/assistant/glossary/GlossarBreadcrump";
import { notFound } from "next/navigation";
import BackgroundPanel from "@/components/assistant/shared/BackgroundPanel";
import style from "./local.module.css";
import { cn } from "@/lib/utils";
import Link from "next/link";
import BackLink from "@/components/assistant/shared/BackLink";
import { getFullEntry } from "@/lib/api/glossary.api";
import EnrichedText from "@/components/assistant/shared/EnrichedText";

const page = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;

  const { id } = params;
  if (id === "") {
    return notFound();
  }
  const entry = await getFullEntry(id);

  if (entry === undefined || entry === null) {
    return notFound();
  }

  return (
    <div>
      <GlossarBreadcrump category={entry.category} entry={entry} />
      <div className="max-w-[800px] mt-6">
        <BackgroundPanel>
          <div className="p-3 pb-0">
            <h1 className="font-bold text-lg">{entry.term.keyword}</h1>
            <span className="text-tc-muted">{entry.category.name}</span>
            <div className={cn("mt-5 db-html-content", style.dbHTML)}>
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
            <div className="mt-10 text-tc-muted w-full flex flex-between flex-wrap gap-y-2">
              {entry.term.sources && entry.term.sources.length > 0 && (
                <div>
                  Quelle(n):{" "}
                  {entry.term.sources.map((link) => {
                    return (
                      <span key={`entry_source_${link.id}`}>
                        <Link
                          href={link.url}
                          target="_blank"
                          className="external-link"
                        >
                          {link.name}
                        </Link>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </BackgroundPanel>
        <div className="mt-3">
          <BackLink text={"Zurück zur Übersicht"} />
        </div>
      </div>
    </div>
  );
};

export default page;
