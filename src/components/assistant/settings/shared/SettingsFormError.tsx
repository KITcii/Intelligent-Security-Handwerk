import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { CustomFormState } from "@/types";
import React from "react";

const SettingsFormError = ({
  state,
  className,
}: {
  state: CustomFormState;
  className?: string;
}) => {
  if (!state.success && state?.message && state?.message !== "") {
    return (
      <div className={cn(className)}>
        <Alert
          variant="destructive"
          className="flex flex-row gap-4 items-center"
        >
          <i className="material-symbols-outlined">warning</i>
          <AlertDescription className="text-base">
            {state.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
};

export default SettingsFormError;
