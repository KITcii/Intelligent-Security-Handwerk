import ProgressBar from "@/components/shared/ProgressBar";
import React from "react";

const LoadingXL = ({ text }: { text?: string }) => {
  return (
    <div className="flex flex-col items-center gap-5">
      <ProgressBar
        progress={50}
        spinner={true}
        style="default"
        className="w-32"
      />
      {text && <div className="font-semibold text-center">{text}...</div>}
    </div>
  );
};

export default LoadingXL;
