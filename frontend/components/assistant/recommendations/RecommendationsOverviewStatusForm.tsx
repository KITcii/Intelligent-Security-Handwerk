"use client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { updateRecommendationsStatus } from "@/lib/actions/recommendations.action";
import { handleSSRFormReturn } from "@/lib/formHelpers";
import { updateRecommendationStatusSchema } from "@/lib/schemes/recommendations.schemes";
import { CustomFormState } from "@/types";
import { RecommendationsListItem } from "@/types/assistant";
import { zodResolver } from "@hookform/resolvers/zod";
import { Row } from "@tanstack/react-table";
import React, { useActionState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import StatusFormUpdateButton from "./StatusFormUpdateButton";
import StatusFormUpdatePending from "./StatusFormUpdatePending";
import { NotificationsContext } from "@/contexts/NotificationsProvider";

const RecommendationsOverviewStatusForm = ({
  rows,
}: {
  rows: Row<RecommendationsListItem>[];
}) => {
  const [state, formAction] = useActionState(
    updateRecommendationsStatus,
    {} as CustomFormState
  );

  const { refreshRecommendationsCounter } = useContext(NotificationsContext);

  const form = useForm<z.infer<typeof updateRecommendationStatusSchema>>({
    resolver: zodResolver(updateRecommendationStatusSchema),
    mode: "onChange",
    defaultValues: {
      status: undefined,
      ...(state?.fields ?? {}),
    },
  });

  useEffect(() => {
    handleSSRFormReturn(form, state, updateRecommendationStatusSchema, true);
    refreshRecommendationsCounter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, state]);

  return (
    <Form {...form}>
      <form action={formAction}>
        <div className="mt-5 flex flex-wrap gap-4 max-w-[500px]">
          {rows.map((row, index) => {
            return (
              <React.Fragment key={`selection_index-${row.original.id}`}>
                <input
                  name={`recommendations.${index}.id`}
                  type="hidden"
                  value={row.original.id}
                />
                <input
                  name={`recommendations.${index}.status`}
                  type="hidden"
                  value={row.original.status}
                />
              </React.Fragment>
            );
          })}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">
                  Alle ausgewählten Empfehlungen:
                </FormLabel>
                <div className="flex flex-row gap-2">
                  <StatusFormUpdateButton value="open" name={field.name}>
                    <>
                      <i className="material-symbols-outlined">visibility</i>
                      <span>Einblenden</span>
                    </>
                  </StatusFormUpdateButton>
                  <StatusFormUpdateButton value="irrelevant" name={field.name}>
                    <>
                      <i className="material-symbols-outlined">
                        visibility_off
                      </i>
                      <span>Ausblenden</span>
                    </>
                  </StatusFormUpdateButton>
                  <StatusFormUpdatePending />
                </div>
                <FormMessage className="text-base" />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default RecommendationsOverviewStatusForm;
