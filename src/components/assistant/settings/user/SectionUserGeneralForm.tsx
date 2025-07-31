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
import { cn } from "@/lib/utils";
import { useActionState, useEffect } from "react";
import SettingsFooter from "@/components/assistant/settings/shared/SettingsFooter";
import { updateUserSchema } from "@/lib/schemes/settings.schemes";
import { updateUser } from "@/lib/actions/user.action";
import SettingsFormError from "../shared/SettingsFormError";
import { CustomFormState } from "@/types";
import { handleSSRFormReturn } from "@/lib/formHelpers";
import { UserRoleLabels } from "@/constants/user";
import { BackendUser } from "@/types/assistant";

const SectionUserGeneralForm = ({
  stateData,
}: {
  stateData: BackendUser | undefined;
}) => {
  const [state, formAction] = useActionState(updateUser, {} as CustomFormState);

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    mode: "onChange",
    defaultValues: {
      firstName: stateData?.firstName ?? "",
      lastName: stateData?.lastName ?? "",
      ...(state?.fields ?? {}),
    },
  });

  useEffect(() => {
    handleSSRFormReturn(form, state, updateUserSchema);
  }, [form, state]);

  return (
    <Form {...form}>
      <form action={formAction} className={cn(style.SettingsForm)}>
        <FormItem className={cn(style.SettingsFormItem)}>
          <FormLabel className={cn(style.SettingsFormLabelWide)}>
            Rolle
          </FormLabel>
          <FormControl className={cn(style.SettingsFormControlWide)}>
            <div className="text-base text-ellipsis	overflow-hidden">
              {stateData &&
                (stateData.roles.includes("OWNER")
                  ? UserRoleLabels.OWNER
                  : stateData.roles.includes("USER")
                    ? UserRoleLabels.USER
                    : "Unbekannt")}
            </div>
          </FormControl>
          <FormMessage className={cn(style.SettingsFormMessageWide)} />
        </FormItem>
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className={cn(style.SettingsFormItem)}>
              <FormLabel className={cn(style.SettingsFormLabelWide)}>
                Vorname
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
          name="lastName"
          render={({ field }) => (
            <FormItem className={cn(style.SettingsFormItem)}>
              <FormLabel className={cn(style.SettingsFormLabelWide)}>
                Nachname
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

export default SectionUserGeneralForm;
