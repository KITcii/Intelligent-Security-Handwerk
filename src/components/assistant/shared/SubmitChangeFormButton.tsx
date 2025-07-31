"use client";

import ProgressBar from "@/components/shared/ProgressBar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { forwardRef, Fragment } from "react";
import { useFormStatus } from "react-dom";

const SubmitChangeFormButton = forwardRef<
  HTMLButtonElement,
  { className?: string; onClick?: () => void }
>((props, ref) => {
  const { pending } = useFormStatus();

  return (
    <Fragment>
      {ref !== undefined && ref !== null ? (
        <Button
          type="submit"
          className={cn("button-success", props.className)}
          ref={ref}
          disabled={pending}
          aria-disabled={pending}
        >
          {pending ? (
            <>
              <span>Speichern...</span>
              <ProgressBar
                progress={50}
                spinner={true}
                style="bold"
                className="w-6 ms-3"
              />
            </>
          ) : (
            "Änderung speichern"
          )}
        </Button>
      ) : (
        <Button
          type="submit"
          className={cn("button-success", props.className)}
          disabled={pending}
          aria-disabled={pending}
          onClick={props.onClick}
        >
          {pending ? (
            <>
              <span>Speichern...</span>
              <ProgressBar
                progress={50}
                spinner={true}
                style="bold"
                className="w-6 ms-3"
              />
            </>
          ) : (
            "Änderung speichern"
          )}
        </Button>
      )}
    </Fragment>
  );
});

SubmitChangeFormButton.displayName = "SubmitChangeFormButton";

export default SubmitChangeFormButton;
