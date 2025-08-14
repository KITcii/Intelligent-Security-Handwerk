import CategorySubPanel from "@/components/assistant/glossary/CategorySubPanel";
import GlossarBreadcrump from "@/components/assistant/glossary/GlossarBreadcrump";
import BackLink from "@/components/assistant/shared/BackLink";
import { getCategoryAndEntriesById } from "@/lib/api/glossary.api";
import { subdivideAndOrder } from "@/lib/utils";
import { GlossaryEntryLight } from "@/types/assistant";
import Link from "next/link";
import { notFound } from "next/navigation";
import {} from "next/navigation";

const Page = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;

  const { id } = params;

  if (id === "") {
    return notFound();
  }

  const category = await getCategoryAndEntriesById(id);

  if (category === undefined) {
    return notFound();
  }

  const entries = category.entries;
  const getObjectKey = (entry: GlossaryEntryLight) => entry.keyword;
  const subdivided = subdivideAndOrder(entries || [], getObjectKey);

  return (
    <div>
      <GlossarBreadcrump category={category} />
      <h1 className="text-lg font-bold mt-4">{category.name}</h1>
      <div className="max-w-[800px] text-tc-muted">{category.description}</div>
      {entries && entries.length > 0 ? (
        <>
          <div className="mt-8">
            <div className="flex flex-wrap gap-3">
              Springe zu:{" "}
              {subdivided &&
                Object.keys(subdivided).map((key) => {
                  return (
                    <Link
                      href={`#jump_anchor_${key}`}
                      key={`jump_link_${key}`}
                      className="inline-link break-words"
                    >
                      {key}
                    </Link>
                  );
                })}
            </div>
          </div>
          <div className="columns-1 md:columns-2 xl:columns-3 mt-4">
            {subdivided &&
              Object.keys(subdivided).map((key) => {
                return (
                  <CategorySubPanel
                    key={key}
                    title={key}
                    entries={subdivided[key]}
                    id={`jump_anchor_${key}`}
                  />
                );
              })}
          </div>
        </>
      ) : (
        <>
          <div className="italic my-24 w-full text-center">
            Keine Einträge vorhanden.
          </div>
        </>
      )}
      <div className="my-3">
        <BackLink text={"Zurück zur Übersicht"} />
      </div>
    </div>
  );
};

export default Page;
