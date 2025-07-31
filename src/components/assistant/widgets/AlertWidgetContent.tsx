import Link from "next/link";
import { formatDateTime } from "@/lib/utils";
import { Note, Reference } from "@/types/csaf";
import { getCustomCurrentAlert } from "@/lib/api/warnings.api";
import DashboardWidgetWrapper from "./shared/DashboardWidgetWrapper";

const AlertWidgetContent = async () => {
  const data = await getCustomCurrentAlert();

  // do not render alert box if there are no alerts
  if (data === undefined || data.csa === undefined) {
    return <></>;
  }

  const url = data?.csa?.document.references?.filter((ref: Reference) => {
    return ref.category === "self" && !ref.url.endsWith(".json");
  })[0]?.url;

  return (
    <DashboardWidgetWrapper
      className="min-w-full"
      contentClassName="text-tc-contrast p-3"
      bg="bg-highlight-50"
    >
      <Link href={url ? url : ""} target="_blank">
        <div className="flex flex-col sm:flex-row items-center cursor-pointer xl:w-5/6">
          <div className="relative flex sm:w-48 max-sm:mb-5">
            <i className="absolute inline-flex material-symbols-outlined thin md-2xl">
              warning
            </i>
            <i className="relative inline-flex material-symbols-outlined thin md-2xl motion-reduce:hidden">
              warning
            </i>
          </div>
          <div className="ms-4">
            <h2 className="font-semibold">
              Dringende Sicherheitswarnung vom{" "}
              <time dateTime={data.csa.document.tracking.current_release_date}>
                {
                  formatDateTime(
                    new Date(data.csa.document.tracking.current_release_date)
                  ).dateOnlyShort
                }{" "}
                (
                {
                  formatDateTime(
                    new Date(data.csa.document.tracking.current_release_date)
                  ).timeOnly
                }{" "}
                Uhr)
              </time>
            </h2>
            <p className="mt-2 font-semibold line-clamp-1">
              {data.csa.document.title}
            </p>
            <p className="line-clamp-3">
              {
                data.csa.document.notes?.filter((note: Note) => {
                  return note.category === "summary";
                })[0]?.text
              }
            </p>
            <p className="line-clamp-3">
              {
                data.csa.document.notes?.filter((note: Note) => {
                  return note.category === "description";
                })[0]?.text
              }
            </p>
            <p className="mt-2 external-link">Weitere Informationen</p>
            <div className="mt-2 sm:text-right text-sm w-full">
              Quelle: {data.csa.document.publisher.name}
            </div>
          </div>
        </div>
      </Link>
    </DashboardWidgetWrapper>
  );
};

export default AlertWidgetContent;
