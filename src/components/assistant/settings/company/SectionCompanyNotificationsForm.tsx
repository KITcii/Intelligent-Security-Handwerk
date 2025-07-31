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
import SettingsFooter from "@/components/assistant/settings/shared/SettingsFooter";
import { Switch } from "@/components/ui/switch";
import { updateCompanyNotificationsSchema } from "@/lib/schemes/settings.schemes";
import { BackendCompany } from "@/types/assistant";
import { updateNotificationsSettings } from "@/lib/actions/company.action";
import { CustomFormState } from "@/types";
import SettingsFormError from "../shared/SettingsFormError";
import { useActionState, useEffect, useState } from "react";
import { handleSSRFormReturn } from "@/lib/formHelpers";

const SectionCompanyNotificationsForm = ({
  stateData,
}: {
  stateData: BackendCompany | undefined;
}) => {
  const [notifications, setNotifications] = useState<boolean>(
    stateData?.notificationsEnabled ?? false
  );
  const [state, formAction] = useActionState(
    updateNotificationsSettings,
    {} as CustomFormState
  );

  const form = useForm<z.infer<typeof updateCompanyNotificationsSchema>>({
    resolver: zodResolver(updateCompanyNotificationsSchema),
    mode: "onChange",
    defaultValues: {
      notificationsEmail: stateData?.notificationsEmail ?? "",
      notificationsEnabled: stateData?.notificationsEnabled ?? false,
      ...(state?.fields ?? {}),
    },
  });

  useEffect(() => {
    handleSSRFormReturn(form, state, updateCompanyNotificationsSchema);
  }, [form, state]);

  return (
    <Form {...form}>
      <form action={formAction} className={cn(style.SettingsForm)}>
        <FormField
          control={form.control}
          name="notificationsEnabled"
          render={({ field }) => (
            <FormItem
              className={cn(style.SettingsFormItem, "place-items-stretch")}
            >
              <FormLabel className={cn(style.SettingsFormLabelUltraWide)}>
                Benachrichtigungen aktivieren
              </FormLabel>
              <Input
                type="hidden"
                name={field.name}
                value={notifications ? "true" : "false"}
              />
              <FormControl className={cn(style.SettingsFormControlUltraWide)}>
                <Switch
                  checked={notifications}
                  className="data-[state=checked]:bg-highlight-100"
                  onCheckedChange={(e) => {
                    setNotifications(e);
                    form.setValue("notificationsEmail", "");
                  }}
                />
              </FormControl>
              <FormMessage className={cn(style.SettingsFormMessageUltraWide)} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notificationsEmail"
          render={({ field }) => (
            <FormItem className={cn(style.SettingsFormItem)}>
              <FormLabel
                className={cn(
                  style.SettingsFormLabel,
                  !notifications && "text-contrast-semidark"
                )}
              >
                E-Mail-Adresse
              </FormLabel>
              <FormControl className={cn(style.SettingsFormControl)}>
                <Input
                  placeholder=""
                  {...field}
                  disabled={!notifications}
                  className="text-base"
                />
              </FormControl>
              <FormMessage className={cn(style.SettingsFormMessage)} />
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

export default SectionCompanyNotificationsForm;
