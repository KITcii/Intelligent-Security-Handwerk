import Header from "@/components/assistant/shared/Header";
import AlertWidget from "@/components/assistant/widgets/AlertWidget";
import ComponentsWidget from "@/components/assistant/widgets/ComponentsWidget";
import ContactWidget from "@/components/assistant/widgets/ContactWidget";
import GlossaryWidget from "@/components/assistant/widgets/GlossaryWidget";
import ITSMMeasuresWidget from "@/components/assistant/widgets/ITSMMeasuresWidget";
import RecommendationsWidget from "@/components/assistant/widgets/RecommendationsWidget";
import SpiderWidget from "@/components/assistant/widgets/SpiderWidget";
import StandardCoverageWidget from "@/components/assistant/widgets/StandardCoverageWidget";
import WarningTickerWidget from "@/components/assistant/widgets/WarningTickerWidget";

const Page = () => {
  return (
    <>
      <Header title="IT-Sicherheitsassistent" />
      <div className="flex flex-row flex-wrap gap-3">
        <ComponentsWidget />
        <ITSMMeasuresWidget />
        <StandardCoverageWidget />
        <RecommendationsWidget />
        <AlertWidget />
        <WarningTickerWidget />
        <ContactWidget />
        <SpiderWidget />
        <GlossaryWidget />
      </div>
    </>
  );
};

export default Page;
