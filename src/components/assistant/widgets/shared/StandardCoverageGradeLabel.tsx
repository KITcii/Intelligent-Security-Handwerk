import { StandardCoverageGradeThemes } from "@/constants/assistant";
import { cn } from "@/lib/utils";
import { StandardCoverageGrade } from "@/types/assistant";
import React from "react";

const StandardCoverageGradeLabel = ({
  grade,
  className,
}: {
  grade?: StandardCoverageGrade;
  className?: string;
}) => {
  if (grade === undefined) {
    return <></>;
  }
  return (
    <span
      className={cn(
        StandardCoverageGradeThemes[grade].textColor ||
          StandardCoverageGradeThemes["DEFAULT"].textColor,
        className
      )}
    >
      {StandardCoverageGradeThemes[grade].label ||
        StandardCoverageGradeThemes["DEFAULT"].label}
    </span>
  );
};

export default StandardCoverageGradeLabel;
