import { getEntriesByCategoryName } from "@/lib/api/glossary.api";
import IncidentSignsKnowledge from "./IncidentSignsKnowledge";

const IncidentSignsKnowledgeWrapper = async () => {
  const topics = await getEntriesByCategoryName("Cyberangriffe");
  if (topics === undefined) {
    return <></>;
  }

  return <IncidentSignsKnowledge topics={topics} />;
};

export default IncidentSignsKnowledgeWrapper;
