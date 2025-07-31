"use client";
import ProgressBar from "@/components/shared/ProgressBar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import { useFormStatus } from "react-dom";

const AuthSubmitButton = ({
  label,
  labelProgress,
  className,
}: {
  label: string;
  labelProgress: string;
  className?: string;
}) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className={cn("button text-base w-full flex flex-row gap-2", className)}
      disabled={pending}
    >
      {pending ? (
        <>
          {labelProgress}
          <ProgressBar
            progress={50}
            spinner={true}
            style="bold"
            className="w-6 ms-3"
          />
        </>
      ) : (
        label
      )}
    </Button>
  );
};

export default AuthSubmitButton;
