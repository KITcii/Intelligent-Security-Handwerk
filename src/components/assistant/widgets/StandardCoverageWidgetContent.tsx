import ProgressBar from "@/components/shared/ProgressBar";
import Link from "next/link";
import { getStandardScore } from "@/lib/api/recommendations.api";
import WidgetError from "./shared/WidgetError";
import StandardCoverageGradeLabel from "./shared/StandardCoverageGradeLabel";

const StandardCoverageWidgetContent = async () => {
  const data = await getStandardScore();

  if (data === undefined) {
    return <WidgetError />;
  }

  return (
    <div className="flex flex-row w-full h-full gap-3 items-center justify-center">
      <ProgressBar
        className="h-full"
        progress={(Math.round(data.coverage * 1000) / 1000) * 100}
      />
      <div className="flex flex-col items-center text-center">
        <span className="mb-3">Abdeckungsgrad</span>
        <p className="font-bold leading-snug">
          {data.grade !== undefined && (
            <StandardCoverageGradeLabel grade={data.grade} />
          )}
          <br />
          {data.website ? (
            <>
              <Link href={data.website}>{data.name}</Link>
            </>
          ) : (
            <span>{data.name}</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default StandardCoverageWidgetContent;
