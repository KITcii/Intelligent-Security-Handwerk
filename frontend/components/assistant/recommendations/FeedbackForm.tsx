"use client";

import FiveStarRating from "@/components/shared/FiveStarRating";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useActionState, useEffect, useState } from "react";
import ThumbsUpAnimation from "../shared/ThumbsUpAnimation";
import Link from "next/link";
import { recommendationFeedbackSchema } from "@/lib/schemes/recommendations.schemes";
import { CustomFormState } from "@/types";
import { sendRecommendationFeedback } from "@/lib/actions/recommendations.action";
import { getZodSchemaFields } from "@/lib/formHelpers";
import SettingsFormError from "../settings/shared/SettingsFormError";
import { toast } from "sonner";
import {
  FORM_SUBMIT_ERROR_MESSAGE,
  FORM_SUBMIT_SUCCESS_MESSAGE,
} from "@/constants/dialog";
import { Input } from "@/components/ui/input";

const FeedbackForm = ({ recommendationId }: { recommendationId: string }) => {
  const [state, formAction] = useActionState(
    sendRecommendationFeedback,
    {} as CustomFormState
  );
  const [submitted, setSubmitted] = useState<boolean>(false);

  const form = useForm<z.infer<typeof recommendationFeedbackSchema>>({
    resolver: zodResolver(recommendationFeedbackSchema),
    mode: "onChange",
    defaultValues: {
      recommendatioId: recommendationId,
      comprehensibility: "1",
      feasibility: "1",
      informative: "1",
      ...(state?.fields ?? {}),
    },
  });

  useEffect(() => {
    form.clearErrors();
    if (state?.success) {
      form.reset();
      toast.success(state.message ?? FORM_SUBMIT_SUCCESS_MESSAGE);
      setSubmitted(true);
    } else if (state?.success !== undefined) {
      toast.error(state.message ?? FORM_SUBMIT_ERROR_MESSAGE);
      if (
        state !== undefined &&
        state.errors !== undefined &&
        Object.keys(state.errors).length > 0
      ) {
        const fields = getZodSchemaFields(recommendationFeedbackSchema);
        fields.forEach((field) => {
          if (
            state.errors !== undefined &&
            Object.hasOwn(state.errors, field) &&
            Array.isArray(state.errors[field])
          ) {
            state.errors[field].forEach((error) => {
              form.setError(
                field as
                  | "comprehensibility"
                  | "feasibility"
                  | "informative"
                  | "comment"
                  | "root"
                  | `root.${string}`,
                { message: error }
              );
            });
          }
        });
      }
    }
  }, [form, state]);

  if (!submitted) {
    return (
      <div className="w-full max-w-[500px] mt-8">
        <Form {...form}>
          <form action={formAction} className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="recommendatioId"
              render={({ field }) => <Input {...field} type="hidden" />}
            />
            <FormField
              control={form.control}
              name="comprehensibility"
              render={({ field }) => (
                <FormItem className="w-full flex flex-between flex-wrap">
                  <FormLabel className="float-left min-[400px]:min-w-96 text-base">
                    Verständlichkeit des Empfehlungstextes
                  </FormLabel>
                  <FormControl className="min-w-38">
                    <FiveStarRating field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="feasibility"
              render={({ field }) => (
                <FormItem className="w-full flex flex-between flex-wrap">
                  <FormLabel className="float-left min-[400px]:min-w-96 text-base">
                    Umsetzbarkeit der Handlungsempfehlung
                  </FormLabel>
                  <FormControl className="min-w-38">
                    <FiveStarRating field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="informative"
              render={({ field }) => (
                <FormItem className="w-full flex flex-between flex-wrap">
                  <FormLabel className="float-left min-[400px]:min-w-96 text-base">
                    Weiterführende Informationen hilfreich
                  </FormLabel>
                  <FormControl className="min-w-38">
                    <FiveStarRating field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl className="min-w-38">
                    <Textarea
                      className="w-full h-28 text-base"
                      placeholder="Tragen Sie hier Ihre Kommentare ein."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full">
              <Button className="button-success text-base" type="submit">
                Absenden
              </Button>
            </div>
            <SettingsFormError state={state} />
          </form>
        </Form>
      </div>
    );
  } else {
    return (
      <div className="w-full flex flex-col justify-center text-center mb-12">
        <ThumbsUpAnimation />
        <div className="font-bold">Vielen Dank!</div>
        <div>Wir haben Ihr Feedback erhalten.</div>

        <Link
          href=""
          onClick={(e) => {
            e.preventDefault();
            setSubmitted(false);
          }}
          className="inline-link mt-8"
        >
          <i className="material-symbols-outlined md-s inline-block align-middle me-1">
            arrow_back
          </i>
          <span className="inline-block align-middle inline-link text-tc-muted">
            Zurück zum Formular
          </span>
        </Link>
      </div>
    );
  }
};

export default FeedbackForm;
