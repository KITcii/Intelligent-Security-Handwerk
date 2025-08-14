"use client";

import ProgressBar from "@/components/shared/ProgressBar";
import { useFormStatus } from "react-dom";

const StatusFormUpdatePending = () => {
  const { pending } = useFormStatus();
  return (
    <div className="flex flex-row gap-2 items-center align-middle">
      {pending && (
        <>
          <ProgressBar
            progress={50}
            spinner={true}
            style="bold"
            className="w-6 ms-3"
          />
          <span>Speichern...</span>
        </>
      )}
    </div>
  );
};

export default StatusFormUpdatePending;
