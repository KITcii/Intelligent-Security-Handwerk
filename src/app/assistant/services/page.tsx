import { DataTableColumns } from "@/components/assistant/guidance/DataTableColumns";
import ServicesTable from "@/components/assistant/guidance/ServicesTable";
import Header from "@/components/assistant/shared/Header";
import { getAllEntries } from "@/lib/api/supportServices.api";
import { ServicesTableFacets } from "@/types/assistant";
import { Suspense } from "react";

const page = async () => {
  const data = await getAllEntries();

  if (data === undefined) {
    return <div>error</div>;
  }

  const facets: ServicesTableFacets = [];
  facets.push({
    column: "topics",
    title: "Inhalte",
    data: Array.from(
      data.reduce(function (result: Set<string>, entry) {
        entry?.offer?.topics?.forEach((topic) => {
          result.add(topic.name);
        });
        return result;
      }, new Set<string>())
    ).sort((a, b) => a.localeCompare(b)),
  });
  facets.push({
    column: "provider",
    title: "Anbieter",
    data: Array.from(
      data.reduce(function (result: Set<string>, entry) {
        if (entry.provider) {
          result.add(entry.provider.name);
        }
        return result;
      }, new Set<string>())
    ).sort((a, b) => a.localeCompare(b)),
  });
  facets.push({
    column: "type",
    title: "Angebotstyp",
    data: Array.from(
      data.reduce(function (result: Set<string>, entry) {
        if (entry.offer) {
          result.add(entry.offer.type);
        }
        return result;
      }, new Set<string>())
    ).sort((a, b) => a.localeCompare(b)),
  });

  return (
    <>
      <Header title="Unterstützungsangebote" />
      <Suspense fallback={<div>Loading...</div>}>
        <ServicesTable data={data} columns={DataTableColumns} facets={facets} />
      </Suspense>
    </>
  );
};

export default page;
