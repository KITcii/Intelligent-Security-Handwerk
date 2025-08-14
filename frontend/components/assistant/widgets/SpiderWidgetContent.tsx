import {
  getStandardCoverage,
  getStandardCoverageDimensions,
} from "@/lib/api/recommendations.api";
import StandardBuildingBlock from "./StandardBuildingBlock";
import WidgetError from "./shared/WidgetError";
import Link from "next/link";
import ProgressBar from "@/components/shared/ProgressBar";
import StandardCoverageGradeLabel from "./shared/StandardCoverageGradeLabel";
import SpiderDiagram from "../shared/SpiderDiagram";

const SpiderWidgetContent = async () => {
  const dimensions = await getStandardCoverageDimensions();
  const data = await getStandardCoverage();

  if (data === undefined || dimensions === undefined) {
    return <WidgetError className="mt-6" />;
  } else if (dimensions.children === undefined || data.sections === undefined) {
    // fallback if no areas are provided
    return (
      <div className="flex lg:flex-row flex-col w-full h-full gap-x-10 gap-y-6 justify-center items-center mt-6">
        <ProgressBar className="h-52" progress={data.coverage * 100} />
        <div className="flex flex-col gap-6">
          <div>
            <p className="font-semibold">Name des Standards</p>
            <p>
              {dimensions.website ? (
                <Link href={dimensions.website} className="inline-link">
                  {dimensions.name}
                </Link>
              ) : (
                <span>{dimensions.name}</span>
              )}
            </p>
          </div>
          <div>
            <p className="font-semibold">Abdeckungsbewertung</p>
            <p>
              <StandardCoverageGradeLabel grade={data.grade} />
            </p>
          </div>
        </div>
      </div>
    );
  }

  const displayValues: number[] = [];

  // normalize coverage values to make them more visible in the spider diagram
  let maxCoverage = 0;
  data.sections?.forEach((section) => {
    if (section.coverage > maxCoverage) {
      maxCoverage = section.coverage;
    }
  });

  let upperBound = 0;
  if (maxCoverage <= 0.25) {
    // 5% steps in the spider diagram
    upperBound = 0.25;
  } else if (maxCoverage <= 0.5) {
    // 10% steps in the spider diagram
    upperBound = 0.5;
  } else if (maxCoverage <= 0.75) {
    // 15% steps in the spider diagram
    upperBound = 0.75;
  } else {
    // 20% steps in the spider diagram
    upperBound = 1;
  }

  // normalize coverage values
  data.sections?.forEach((section) => {
    displayValues[section.standardElementId] = section.coverage / upperBound;
  });

  return (
    <div className="flex flex-col">
      <div> Abbildungsmaßstab: 0% – {upperBound * 100}%</div>
      <div className="flex flex-col xl:flex-row justify-between xl:items-center">
        <div className="min-w-52 max-w-80 md:w-96" id="spiderWidget">
          <SpiderDiagram
            data={dimensions.children
              .map((area) => {
                const areaData = data.sections.find(
                  (section) => section.standardElementId === area.id
                );
                const displayData = displayValues[area.id];
                return {
                  label: `${area.name}`,
                  display: displayData,
                  value: areaData?.coverage || 0,
                };
              })
              .sort((a, b) => {
                // sort dimensions so that the ones with no coverage are at the end
                if (a.display === 0) {
                  return 1;
                } else if (b.display === 0) {
                  return -1;
                } else return 0;
              })}
            width={340}
            height={230}
            className="ml-[0px] pr-3"
          />
        </div>
        <div className="border border-contrast-neutral rounded bg-contrast-light p-4">
          <h2 className="font-semibold mb-2">Bausteine des Standards</h2>
          <div className="flex flex-row flex-wrap min-w-48 max-w-52 h-min gap-1 text-tc-contrast">
            {dimensions.children.map((area, index) => {
              return (
                <StandardBuildingBlock
                  key={`standard_building_block_${index}_${area.id}`}
                  area={area}
                  values={data.sections}
                  className="flex-1"
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SpiderWidgetContent;
