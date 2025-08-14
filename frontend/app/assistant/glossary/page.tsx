import CategoryOverview from "@/components/assistant/glossary/CategoryOverview";
import GlossarSearchResults from "@/components/assistant/glossary/GlossarSearchResults";
import ContentSearch from "@/components/assistant/shared/ContentSearch";
import LoadingXL from "@/components/assistant/shared/LoadingXL";
import { searchEntries } from "@/lib/api/glossary.api";
import { Suspense } from "react";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const query = ((await searchParams).query as string) || "";
  const page = ((await searchParams).page as string) || "1";
  const searchResults = await searchEntries({
    query: query,
    page: Number(page),
    limit: 20,
  });

  return (
    <>
      {/* Search bar */}
      <div className="w-full mb-10">
        <ContentSearch placeholder="Zu welchem IT-Sicherheitsthema möchten Sie mehr erfahren?" />
      </div>
      {/* Categories */}
      {!searchResults && (
        <Suspense
          fallback={<LoadingXL text="Wissenskategorien werden geladen" />}
        >
          <CategoryOverview />
        </Suspense>
      )}
      {/* Search Results */}
      {searchResults && <GlossarSearchResults searchResults={searchResults} />}
    </>
  );
};

export default Page;
