import { getAllRecommendations } from "@/lib/api/recommendations.api";
import ErrorXL from "../shared/ErrorXL";
import {
  RecommendationsListItem,
  RecommendationStatus,
} from "@/types/assistant";
import RecommendationsOverviewContent from "./RecommendationsOverviewContent";

const RecommendationsOverview = async () => {
  const data = await getAllRecommendations();
  if (data === undefined) {
    return (
      <ErrorXL cause="Datanabruf ist fehlgeschlagen!" className="min-h-96" />
    );
  }

  const items: RecommendationsListItem[] = [];

  data.forEach((item) => {
    let newstatus: RecommendationStatus = "open";
    if (item.status === "OPEN") {
      newstatus = "open";
    } else if (item.status === "IN_PROCESS") {
      newstatus = "in_progress";
    } else if (item.status === "IMPLEMENTED") {
      newstatus = "done";
    } else if (item.status === "IRRELEVANT") {
      newstatus = "irrelevant";
    }

    items.push({
      id: item.control.id,
      title: item.control.name,
      status: newstatus,
      bedrohungsmass: item.severity,
      direkteBedrohungen: item.control.threats || [],
      beguenstigteBedrohungen: [],
    });
  });

  return <RecommendationsOverviewContent data={items} />;
};

export default RecommendationsOverview;
