import { cn } from "@/lib/utils";
import React from "react";

const WidgetError = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "h-full w-full flex flex-col justify-center items-center text-center",
        className
      )}
    >
      <p className="opacity-45 leading-tight line-clamp-2">
        Datenabruf
        <br />
        fehlgeschlagen
      </p>
    </div>
  );
};

export default WidgetError;
