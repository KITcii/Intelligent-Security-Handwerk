"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Etwas ist schief gelaufen!</h2>
      <Button className="mt-4 button-default" onClick={() => reset()}>
        Seite neu laden
      </Button>
    </div>
  );
}
