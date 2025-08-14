import DashboardWidget from "../widgets/DashboardWidget";
import Link from "next/link";
import { GlossaryEntryLight } from "@/types/assistant";

const CategorySubPanel = ({
  id,
  title,
  entries,
}: {
  id: string;
  title: string;
  entries: GlossaryEntryLight[];
}) => {
  return (
    <DashboardWidget className="mb-3" title={title} id={id}>
      <div className="px-2 max-w-80">
        <ul>
          {entries &&
            entries.map((entry) => {
              return (
                <li key={entry.id} className="my-3">
                  <p className="break-words leading-tight	">
                    <Link
                      href={`/assistant/glossary/details/entry/${entry.id}`}
                      className="inline-link break-words"
                    >
                      {entry.keyword}
                    </Link>
                  </p>
                </li>
              );
            })}
        </ul>
      </div>
    </DashboardWidget>
  );
};

export default CategorySubPanel;
