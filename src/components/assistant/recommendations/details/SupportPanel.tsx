import React from "react";
import BackgroundPanel from "../../shared/BackgroundPanel";
import SupportTopicsList from "./SupportTopicsList";
import SupportServicesList from "./SupportServicesList";
import { BackendRecommendation } from "@/types/assistant";

const SupportPanel = ({ data }: { data: BackendRecommendation }) => {
  if (
    data.support === undefined ||
    (data.support.topics === undefined && data.support.listings === undefined)
  ) {
    return <></>;
  }

  return (
    <BackgroundPanel
      bg="bg-contrast-dark"
      textColor="text-tc-contrast"
      title="Weiterführende Angebote"
      className="overflow-hidden"
      contentClassName="ps-9"
    >
      <div className="mt-8 mb-6 flex flex-col gap-x-12 gap-y-8 sm:flex-row items-start h-full flex-wrap ">
        {data.support.topics && (
          <div className="sm:min-w-[200px] sm:max-w-[250px] overflow-auto">
            <SupportTopicsList topics={data.support.topics} />
          </div>
        )}
        {data.support.listings && (
          <div className=" sm:max-w-[500px]">
            <SupportServicesList services={data.support.listings} />
          </div>
        )}
      </div>
    </BackgroundPanel>
  );
};

export default SupportPanel;
