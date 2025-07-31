import WidgetError from "./shared/WidgetError";
import { getRecommendationsMetaData } from "@/lib/api/recommendations.api";

const RecommendationsWidgetContent = async () => {
  const data = await getRecommendationsMetaData();

  if (data === undefined) {
    return <WidgetError className="text-tc-contrast" />;
  }

  return (
    <div className="flex flex-col items-center text-center gap-1">
      <p className="leading-none">
        Neue
        <br />
        Empfehlungen
      </p>
      <span className="text-6xl">
        {data.newCounter <= 0 ? "0" : Math.ceil(data.newCounter)}
      </span>
    </div>
  );
};

export default RecommendationsWidgetContent;
