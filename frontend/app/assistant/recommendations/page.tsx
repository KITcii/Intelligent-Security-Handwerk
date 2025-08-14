import RecommendationsOverview from "@/components/assistant/recommendations/RecommendationsOverview";
import SuspenseOverviewTable from "@/components/assistant/recommendations/SuspenseOverviewTable";
import BackgroundPanel from "@/components/assistant/shared/BackgroundPanel";
import Header from "@/components/assistant/shared/Header";
import { Suspense } from "react";

const page = () => {
  return (
    <>
      <Header title="Handlungsempfehlungen" />
      <div className="flex flex-col gap-10">
        <BackgroundPanel>
          <div className="mb-10">
            <h1 className="text-lg font-bold">Ihre Handlungsempfehlungen</h1>
            <p className="mt-3 max-w-[800px]">
              Die folgenden Handlungsempfehlungen wurden durch den
              Sicherheitsassistenten auf Basis Ihrer aktuellen Abgaben zu Ihrer
              IT-Infrastruktur generiert.
            </p>
          </div>
          <Suspense fallback={<SuspenseOverviewTable />}>
            <RecommendationsOverview />
          </Suspense>
        </BackgroundPanel>
      </div>
    </>
  );
};

export default page;
