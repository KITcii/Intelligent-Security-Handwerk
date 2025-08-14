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
import style from "@/components/assistant/settings/shared/settings.module.css";
import { cn } from "@/lib/utils";
import PasswordStrengthIndicator from "@/components/assistant/shared/PasswordStrengthIndicator";
import SettingsFooter from "@/components/assistant/settings/shared/SettingsFooter";
import { CustomFormState } from "@/types";
import { updatePassword } from "@/lib/actions/user.action";
import { updateUserPasswordSchema } from "@/lib/schemes/settings.schemes";
import { FormEvent, useActionState, useEffect, useState } from "react";
import { handleSSRFormReturn } from "@/lib/formHelpers";
import SettingsFormError from "../shared/SettingsFormError";
import PasswordInput from "@/components/shared/PasswordInput";

const SettingsUserPasswordForm = () => {
  const [password, setPassword] = useState<string>("");
  const [state, formAction] = useActionState(
    updatePassword,
    {} as CustomFormState
  );

  const form = useForm<z.infer<typeof updateUserPasswordSchema>>({
    resolver: zodResolver(updateUserPasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      passwordConfirm: "",
      ...(state?.fields ?? {}),
    },
  });

  useEffect(() => {
    handleSSRFormReturn(form, state, updateUserPasswordSchema, true);
    if (state?.success) {
      setPassword("");
    }
  }, [form, state]);

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  };

  return (
    <Form {...form}>
      <form action={formAction} className={cn(style.SettingsForm)}>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <>
              <FormItem className={style.SettingsFormItem}>
                <FormLabel className={style.SettingsFormLabelWide}>
                  Neues Passwort
                </FormLabel>
                <FormControl className={style.SettingsFormControlWide}>
                  <PasswordInput
                    props={field}
                    className={style.SettingsFormControlWide}
                    onChangeCapture={(e) => handleChange(e)}
                  />
                </FormControl>
                <FormMessage className={cn(style.SettingsFormMessageWide)} />
              </FormItem>
              {password && (
                <div className={cn(style.SettingsFormItem)}>
                  <div className={"col-span-5 col-start-4"}>
                    <PasswordStrengthIndicator
                      className={style.SettingsFormMessageWide}
                      password={password}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        />
        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem className={cn(style.SettingsFormItem)}>
              <FormLabel className={cn(style.SettingsFormLabelWide)}>
                Neues Passwort wiederholen
              </FormLabel>
              <FormControl className={style.SettingsFormControlWide}>
                <PasswordInput
                  props={field}
                  className={style.SettingsFormControlWide}
                />
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

export default SettingsUserPasswordForm;
