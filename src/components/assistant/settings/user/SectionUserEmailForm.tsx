"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import style from "@/components/assistant/settings/shared/settings.module.css";
import SettingsFooter from "@/components/assistant/settings/shared/SettingsFooter";
import { updateUserEmailSchema } from "@/lib/schemes/settings.schemes";
import { updateEmail } from "@/lib/actions/user.action";
import { CustomFormState } from "@/types";
import { useActionState, useEffect } from "react";
import { handleSSRFormReturn } from "@/lib/formHelpers";
import SettingsFormError from "../shared/SettingsFormError";
import { cn } from "@/lib/utils";
import { BackendUser } from "@/types/assistant";

const SectionUserEmailForm = ({
  stateData,
}: {
  stateData: BackendUser | undefined;
}) => {
  const [state, formAction] = useActionState(
    updateEmail,
    {} as CustomFormState
  );

  const form = useForm<z.infer<typeof updateUserEmailSchema>>({
    resolver: zodResolver(updateUserEmailSchema),
    mode: "onChange",
    defaultValues: {
      mail: "",
      mailConfirm: "",
      ...(state?.fields ?? {}),
    },
  });

  useEffect(() => {
    handleSSRFormReturn(form, state, updateUserEmailSchema, true);
  }, [form, state]);

  return (
    <Form {...form}>
      <form action={formAction} className={cn(style.SettingsForm)}>
        <FormItem className={cn(style.SettingsFormItem)}>
          <FormLabel className={cn(style.SettingsFormLabelWide)}>
            Aktuelle E-Mail Adresse
          </FormLabel>
          <FormControl className={cn(style.SettingsFormControlWide)}>
            <div className="text-base text-ellipsis	overflow-hidden">
              {stateData && stateData.mail}
            </div>
          </FormControl>
          <FormMessage className={cn(style.SettingsFormMessageWide)} />
        </FormItem>
        <FormField
          control={form.control}
          name="mail"
          render={({ field }) => (
            <FormItem className={cn(style.SettingsFormItem)}>
              <FormLabel className={cn(style.SettingsFormLabelWide)}>
                Neue E-Mail-Adresse
              </FormLabel>
              <FormControl className={cn(style.SettingsFormControlWide)}>
                <Input placeholder="" {...field} className="text-base" />
              </FormControl>
              <FormMessage className={cn(style.SettingsFormMessageWide)} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mailConfirm"
          render={({ field }) => (
            <FormItem className={cn(style.SettingsFormItem)}>
              <FormLabel className={cn(style.SettingsFormLabelWide)}>
                E-Mail-Adresse wiederholen
              </FormLabel>
              <FormControl className={cn(style.SettingsFormControlWide)}>
                <Input placeholder="" {...field} className="text-base" />
              </FormControl>
              <FormMessage className={cn(style.SettingsFormMessageWide)} />
            </FormItem>
          )}
        />

        <SettingsFormError
          state={state}
          className={cn(style.SettingsFormError)}
        />
        <SettingsFooter />
      </form>
    </Form>
  );
};

export default SectionUserEmailForm;
