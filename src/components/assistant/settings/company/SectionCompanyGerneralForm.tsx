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
import Combobox from "@/components/shared/Combobox";
import { updateCompanySchema } from "@/lib/schemes/settings.schemes";
import { BackendCompany, BackendCompanyProfession } from "@/types/assistant";
import { updateCompany } from "@/lib/actions/company.action";
import { CustomFormState } from "@/types";
import { useActionState, useEffect } from "react";
import { handleSSRFormReturn } from "@/lib/formHelpers";
import SettingsFormError from "../shared/SettingsFormError";
import { CompanySizeClassValues } from "@/constants";

const SectionCompanyGerneralForm = ({
  stateData,
  metaProps,
}: {
  stateData: BackendCompany | undefined;
  metaProps: {
    professions: BackendCompanyProfession[] | undefined;
  };
}) => {
  const [state, formAction] = useActionState(
    updateCompany,
    {} as CustomFormState
  );

  const form = useForm<z.infer<typeof updateCompanySchema>>({
    resolver: zodResolver(updateCompanySchema),
    mode: "onChange",
    defaultValues: {
      name: stateData?.name || "",
      professionId: stateData?.profession?.id ?? undefined,
      companyType: stateData?.companyType ?? undefined,
      ...(state?.fields ?? {}),
    },
  });

  useEffect(() => {
    handleSSRFormReturn(form, state, updateCompanySchema, false);
  }, [form, state]);

  return (
    <Form {...form}>
      <form action={formAction} className={cn(style.SettingsForm)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className={cn(style.SettingsFormItem)}>
              <FormLabel className={cn(style.SettingsFormLabel)}>
                Betriebsname
              </FormLabel>
              <FormControl className={cn(style.SettingsFormControl)}>
                <Input placeholder="" {...field} className="text-base" />
              </FormControl>
              <FormMessage className={cn(style.SettingsFormMessage)} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="professionId"
          render={({ field }) => (
            <FormItem className={cn(style.SettingsFormItem)}>
              <FormLabel className={cn(style.SettingsFormLabel)}>
                Handwerksgewerbe
              </FormLabel>
              <Combobox
                placeholder="Gewerbe"
                name={field.name}
                value={field.value}
                className={style.SettingsFormControl}
                contextWidth="min-w-[400px]"
                allowEmpty={true}
                data={
                  metaProps.professions !== undefined
                    ? metaProps.professions.map((p) => {
                        return { value: p.id, label: p.name };
                      })
                    : [
                        {
                          value: "0",
                          label: "Lade Einträge",
                        },
                      ]
                }
              />
              <FormMessage className={cn(style.SettingsFormMessage)} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyType"
          render={({ field }) => (
            <FormItem className={cn(style.SettingsFormItem)}>
              <FormLabel className={cn(style.SettingsFormLabel)}>
                Betriebsgröße
              </FormLabel>
              <Combobox
                placeholder="Betriebsgröße nach Mitarbeiteranzahl"
                name={field.name}
                value={field.value}
                className={style.SettingsFormControl}
                allowEmpty={true}
                data={CompanySizeClassValues.map((ec) => {
                  return { value: ec.id, label: ec.name };
                })}
              />
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

export default SectionCompanyGerneralForm;
