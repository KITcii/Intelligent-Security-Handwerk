import React from "react";
import styles from "./ProgressBar.module.css";
import { cn } from "@/lib/utils";

const ProgressBar = ({
  progress,
  spinner = false,
  style = "default",
  className,
}: {
  progress: number;
  spinner?: boolean;
  style?: "default" | "bold";
  className?: string;
}) => {
  const [strokeBG, strokeBar] =
    style === "bold"
      ? ["stroke-[8.5]", "stroke-[4.5]"]
      : ["stroke-[4.5]", "stroke-[1.5]"];

  return (
    <div
      className={cn(
        "grid place-items-center relative aspect-square",
        spinner ? "animate-spin-slow" : "",
        className
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-4 -4 40 40"
        className="absolute left-0 top-0 w-full h-full rotate-[-90deg] fill-none"
      >
        <circle
          cx="16"
          cy="16"
          r="16"
          className={cn("stroke-contrast-neutral", strokeBG)}
        />

        <circle
          cx="16"
          cy="16"
          r="16"
          className={cn(
            styles.progressbarProgress,
            "fill-none stroke-highlight-100",
            strokeBar
          )}
          style={{ "--progress": progress } as React.CSSProperties}
        />
        {!spinner && (
          <text
            x="16"
            y="-15"
            fontSize="7.5"
            transform="rotate(90)"
            className="font-semibold fill-tc"
            style={{
              textAnchor: "middle",
              dominantBaseline: "middle",
            }}
          >
            {progress.toLocaleString("de")}%
          </text>
        )}
      </svg>
    </div>
  );
};

export default ProgressBar;
