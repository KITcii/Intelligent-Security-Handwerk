import Header from "@/components/assistant/shared/Header";
import Link from "next/link";
import GridLayout from "@/components/assistant/recommendations/details/GridLayout";
import { notFound } from "next/navigation";
import { getRecommendationById } from "@/lib/api/recommendations.api";
import { getAssetById } from "@/lib/api/assets.api";

const Page = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const { id } = params;
  const data = await getRecommendationById(id);

  if (data === undefined || data.recommendation === undefined) {
    return notFound();
  }
  const measure = await getAssetById({
    id: data.recommendation.controlID,
    variant: "measures",
  });

  if (measure === undefined) {
    return notFound();
  }

  return (
    <>
      <Header title="Handlungsempfehlungen" />
      <h1 className="text-xl font-bold mb-10">
        Handlungsempfehlung ({data.recommendation.name})
      </h1>
      <div className="mb-5">
        <Link href="/assistant/recommendations" className="inline-link">
          <i className="material-symbols-outlined md-s inline-block align-middle me-1">
            arrow_back
          </i>
          <span className="inline-block align-middle inline-link">
            Zurück zur Übersicht
          </span>
        </Link>
      </div>
      <GridLayout data={data} asset={measure} />
    </>
  );
};

export default Page;
