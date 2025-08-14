import { RecommendationAffectedComponent } from "@/types/assistant";
import React from "react";

const AffectedComponents = ({
  assets,
}: {
  assets: RecommendationAffectedComponent[] | undefined;
}) => {
  if (assets === undefined || assets.length === 0) {
    return <></>;
  }

  return (
    <div>
      <h2 className="font-semibold mt-6 mb-3 text-highlight-100">
        Betroffene IT-Komponenten:
      </h2>

      <div className="grid grid-cols-12 gap-y-2">
        {assets.map((asset) => {
          return (
            <React.Fragment key={`asset_class_${asset.id}`}>
              <div className="col-span-3 font-semibold bg-contrast-light px-4 py-2">
                <a
                  href={`/assistant/infrastructure?aid=${asset.component.id}`}
                  className="inline-link"
                >
                  {asset.component.name}
                </a>
              </div>
              <div className="col-span-9 px-4 py-2">
                {asset?.aliases && asset.aliases.length > 0 ? (
                  <ul className="ms-5">
                    {asset.aliases.map((alias, index) => {
                      return (
                        <li
                          className="list-outside list-disc"
                          key={`component_${asset.id}_alias_${index}`}
                        >
                          <a
                            href={`/assistant/infrastructure?aid=${asset.component.id}`}
                            className="inline-link"
                          >
                            {alias.alias}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <span>
                    Alle Komponenten dieses Typs{" "}
                    <i>(bisher keine Alias-Namen vergeben)</i>
                  </span>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default AffectedComponents;
