import WarningTickerItem from "./WarningTickerItem";
import Link from "next/link";
import { formatTimeDiff } from "@/lib/utils";
import WidgetError from "./shared/WidgetError";
import { getCustomFeed } from "@/lib/api/warnings.api";

const WarningTickerWidgetContent = async () => {
  const data = await getCustomFeed({ page: 0, maxItems: 15 });

  if (data === undefined) {
    return <WidgetError />;
  } else if (data.items === undefined) {
    return <>Es liegen keine relevanten Sicherheitswarnungen vor.</>;
  }

  return (
    <>
      {data && (
        <div>
          <div>
            {data.items.map((warning, index) => {
              if (warning !== undefined) {
                return (
                  <WarningTickerItem
                    key={index}
                    csa={warning.csa}
                    // nextIteration: link assets
                    // assets={warning.assets}
                  />
                );
              }
            })}
          </div>
          <div className="mt-4">
            Quelle:{" "}
            <Link href={data.sourceUrl} target="_blank" className="inline-link">
              {data.sourceName}
            </Link>{" "}
            (Zuletzt aktualisiert:{" "}
            {formatTimeDiff(new Date(Date.now()), data.lastUpdated)})
          </div>
        </div>
      )}
    </>
  );
};

export default WarningTickerWidgetContent;
