"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { forwardRef, Fragment } from "react";
import { useFormStatus } from "react-dom";

const StatusFormUpdateButton = forwardRef<
  HTMLButtonElement,
  {
    name: string;
    value: string;
    children: React.ReactElement;
    className?: string;
  }
>((props, ref) => {
  const { pending } = useFormStatus();

  return (
    <Fragment>
      {ref !== undefined && ref !== null ? (
        <Button
          type="submit"
          className={cn("button", props.className)}
          ref={ref}
          disabled={pending}
          aria-disabled={pending}
          name={props.name}
          value={props.value}
        >
          <div className="flex flex-row items-center align-middle gap-1">
            {props.children}
          </div>
        </Button>
      ) : (
        <Button
          type="submit"
          className={cn("button", props.className)}
          disabled={pending}
          aria-disabled={pending}
          name={props.name}
          value={props.value}
        >
          <div className="flex flex-row items-center align-middle gap-1">
            {props.children}
          </div>
        </Button>
      )}
    </Fragment>
  );
});

StatusFormUpdateButton.displayName = "StatusFormUpdateButton";

export default StatusFormUpdateButton;
