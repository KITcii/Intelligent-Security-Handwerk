"use client";

import { Button } from "../ui/button";

const GeneralErrorMessage = () => {
  const handleRefresh = () => {
    if (typeof window !== "undefined") {
      location.reload();
    }
  };
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Etwas ist schief gelaufen!</h2>
      <Button className="mt-4 button- text-base" onClick={handleRefresh}>
        <i className="material-symbols-outlined me-2">refresh</i>Seite neu laden
      </Button>
    </div>
  );
};

export default GeneralErrorMessage;
