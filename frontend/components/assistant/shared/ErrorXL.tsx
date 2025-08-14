import { cn } from "@/lib/utils";
import React from "react";

const ErrorXL = ({
  cause,
  className,
}: {
  cause?: string;
  className?: string;
}) => {
  return (
    <div className={cn("w-full h-full flex flex-col items-center", className)}>
      <i className="material-symbols-outlined md-3xl text-danger-mid">
        warning
      </i>
      <h2 className="font-semibold text-center text-lg">
        {cause ?? "Es ist ein Fehler aufgetreten!"}
      </h2>
      <p className="max-w-96 text-center leading-snug	mt-3">
        Bitte versuchen Sie es zu einem späteren Zeitpunkt erneut. Sollte das
        Problem weiterhin bestehen, wenden Sie sich bitte an unseren Support.
      </p>
    </div>
  );
};

export default ErrorXL;
