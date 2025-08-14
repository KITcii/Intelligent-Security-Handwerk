"use client";

import BackgroundPanel from "../../shared/BackgroundPanel";
import AffectedComponents from "./AffectedComponents";
import Link from "next/link";
import { Asset, AssetInstance, BackendRecommendation } from "@/types/assistant";
import GuidelineList from "../../assets/edit/GuidelineList";
import { useState } from "react";

const RecommendationPanel = ({
  data,
  asset,
}: {
  data: BackendRecommendation;
  asset: Asset;
}) => {
  const [instance, setInstance] = useState<AssetInstance | undefined>(
    data.state
  );
  const refreshData = (instance: AssetInstance | undefined) => {
    setInstance(instance);
  };

  return (
    <BackgroundPanel>
      <div className="flex flex-col gap-5 ">
        <BackgroundPanel
          bg="bg-highlight-100"
          textColor="text-tc-contrast"
          className="mt-4"
        >
          <div className="px-2 pb-3 text-tc-contrast/15">
            <div className="text-[2rem] md:text-[3rem] mb-5 mt-0 font-extrabold w-full uppercase tracking-wider max-sm:hidden">
              Handlungsempfehlung
            </div>
            <div className="shadow-inner rounded p-9 text-tc bg-contrast-verylight">
              <p className="mb-4 font-semibold">{data.recommendation.text}</p>
              {asset.guidelines !== undefined && (
                <GuidelineList
                  guidelines={asset.guidelines}
                  instance={instance}
                  controlId={asset.id}
                  variant="recommendation"
                  refreshData={refreshData}
                />
              )}
              {data.components && data.components.length > 0 && (
                <AffectedComponents assets={data.components} />
              )}
            </div>
          </div>
        </BackgroundPanel>
        <div className="flex flex-col gap-4 pe-6 ps-3">
          <h4 className="font-semibold">Erläuterung:</h4>
          <div>{data.recommendation.reason}</div>
          <div>{data.recommendation.explanation}</div>
          {data.recommendation.threats !== undefined && (
            <div>
              Bei Eintritt der genannten Bedrohungen können folgende weitere
              Bedrohungen begünstigt werden:{" "}
              {data.recommendation.threats.map((threat, index) => {
                return (
                  <span key={`threats_indirect_${index}`}>
                    {threat.name}
                    {data.recommendation.threats !== undefined &&
                      index < data.recommendation.threats.length - 1 &&
                      ","}{" "}
                  </span>
                );
              })}
            </div>
          )}
          {data.sources && (
            <div className="mt-10 bg-contrast-light p-5 rounded-lg">
              <h3>
                <i>Herkunft der Empfehlung:</i>
              </h3>
              <ul>
                {data.sources.map((source, index) => {
                  return (
                    <li key={`r_source_${index}`}>
                      {source.url ? (
                        <Link
                          href={source.url}
                          target="_blank"
                          className="external-link"
                        >
                          {source.name}
                        </Link>
                      ) : (
                        source.name
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </BackgroundPanel>
  );
};

export default RecommendationPanel;
