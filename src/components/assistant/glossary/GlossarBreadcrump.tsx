import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { GlossaryCategory, GlossaryEntry } from "@/types/assistant";
import React from "react";

const GlossarBreadcrump = ({
  category,
  entry,
}: {
  category?: GlossaryCategory | undefined;
  entry?: GlossaryEntry | undefined;
}) => {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-base">
        <BreadcrumbItem>
          <BreadcrumbLink href={`/assistant/glossary`} className="inline-link">
            Übersicht
          </BreadcrumbLink>
        </BreadcrumbItem>
        {category && (
          <React.Fragment>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/assistant/glossary/details/cat/${category.id}`}
                className="inline-link"
              >
                {category.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </React.Fragment>
        )}
        {entry && (
          <React.Fragment>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{entry.term.keyword}</BreadcrumbPage>
            </BreadcrumbItem>
          </React.Fragment>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default GlossarBreadcrump;
