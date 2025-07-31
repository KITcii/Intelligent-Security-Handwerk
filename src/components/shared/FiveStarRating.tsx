"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { FormControl, FormItem, FormLabel } from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Input } from "../ui/input";

const FiveStarRating = ({
  field,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, any>;
}) => {
  const [rating, setRating] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  return (
    <>
      <RadioGroup
        onValueChange={field.onChange}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        defaultValue={field.value}
        className="min-w-38 flex justify-end"
      >
        {[...Array<number>(5)].map((star, index) => {
          const currentRating = index + 1;
          return (
            <FormItem key={`${field.name}_${index}`}>
              <FormControl>
                <RadioGroupItem
                  value={currentRating.toString()}
                  onChange={() => setRating(currentRating)}
                  className="hidden"
                />
              </FormControl>
              <FormLabel>
                <span
                  className={cn(
                    "material-symbols-outlined text-highlight-100 cursor-pointer",
                    currentRating <= (hover || rating || Number(field.value))
                      ? "filled"
                      : ""
                  )}
                  onMouseEnter={() => setHover(currentRating)}
                  onMouseLeave={() => setHover(null)}
                >
                  grade
                </span>
              </FormLabel>
            </FormItem>
          );
        })}
      </RadioGroup>
      <Input
        type="hidden"
        className="w-full h-28 text-base"
        placeholder="Tragen Sie hier Ihre Kommentare ein."
        {...field}
      />
    </>
  );
};

export default FiveStarRating;
