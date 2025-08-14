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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import style from "@/components/assistant/settings/shared/settings.module.css";
import { cn } from "@/lib/utils";
import SettingsFooter from "@/components/assistant/settings/shared/SettingsFooter";
import React, {
  FormEvent,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/shared/ProgressBar";
import { updateCompanyAddressSchema } from "@/lib/schemes/settings.schemes";
import { BackendCompany } from "@/types/assistant";
import { updateAddress } from "@/lib/actions/company.action";
import {
  BackendCompanyLocation,
  CustomFormState,
  ZipCodeEntryLight,
} from "@/types";
import { handleSSRFormReturn } from "@/lib/formHelpers";
import SettingsFormError from "../shared/SettingsFormError";
import { Separator } from "@/components/ui/separator";
import { findZipCodes, getFullZipCode } from "@/lib/api/zipCodes.api";

const SectionCompanyAddressForm = ({
  stateData,
}: {
  stateData: BackendCompany | undefined;
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [zipCodes, setZipCodes] = useState<ZipCodeEntryLight[] | undefined>(
    undefined
  );
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [loadingAddress, setLoadingAddress] = useState<boolean>(false);

  const searchLimit = 15;

  const submitRef = useRef<HTMLButtonElement | null>(null);

  const [state, formAction] = useActionState(
    updateAddress,
    {} as CustomFormState
  );

  const form = useForm<z.infer<typeof updateCompanyAddressSchema>>({
    resolver: zodResolver(updateCompanyAddressSchema),
    mode: "onChange",
    defaultValues: {
      query: "",
      id: stateData?.location?.id ?? "",
      zipCode: stateData?.location?.postalCode ?? "",
      town: stateData?.location?.name ?? "",
      county: stateData?.location?.county?.name ?? "",
      federalState: stateData?.location?.county?.state?.name ?? "",
      country: stateData?.location?.county?.state?.country?.name ?? "",
      ...(state?.fields ?? {}),
    },
  });

  useEffect(() => {
    handleSSRFormReturn(form, state, updateCompanyAddressSchema);
  }, [form, state]);

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    setQuery(e.currentTarget.value);
  };

  const handleClearForm = () => () => {
    form.setValue("id", "");
    form.setValue("query", "");
    form.setValue("zipCode", "");
    form.setValue("town", "");
    form.setValue("county", "");
    form.setValue("federalState", "");
    form.setValue("country", "");
  };

  // handle click on autocomplete search result
  const handleClick = (id: number) => {
    setOpen(false);
    async function fetchData() {
      setLoadingAddress(true);
      await getFullZipCode(id).then(
        (data: BackendCompanyLocation | undefined) => {
          if (data !== undefined) {
            form.setValue("id", data?.id.toString() || "");
            form.setValue("zipCode", data?.postalCode || "");
            form.setValue("town", data?.name || "");
            form.setValue("county", data?.county.name || "");
            form.setValue("federalState", data?.county.state.name || "");
            form.setValue("country", data?.county.state.country.name || "");
            form.setValue("query", "");
          }
        }
      );
    }
    fetchData()
      .then(() => setQuery(""))
      .then(() => form.clearErrors())
      .catch(() => {})
      .finally(() => {
        void setLoadingAddress(false);
      });
    if (submitRef !== null) {
      submitRef.current?.focus();
    }
  };

  // autocomplete search
  useEffect(() => {
    const fetchData = async () => {
      setLoadingSearch(true);
      if (query !== "" && !query.match(/^\s+$/)) {
        setOpen(true);
        await findZipCodes(query, searchLimit).then(
          (data: ZipCodeEntryLight[] | undefined) => {
            if (data !== undefined) {
              setZipCodes(data);
            }
          }
        );
      } else {
        setZipCodes(undefined);
        setOpen(false);
      }
    };

    // prevent too many requests
    const delayDebounceFn = setTimeout(() => {
      fetchData()
        .catch(() => {})
        .finally(() => {
          void setLoadingSearch(false);
        });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <Form {...form}>
      <form action={formAction} className={cn(style.SettingsForm)}>
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem className={cn(style.SettingsFormItem)}>
              <FormLabel className={cn(style.SettingsFormLabel, "col-span-8")}>
                Adresse suchen
              </FormLabel>
              <div className={cn(style.SettingsFormControl, "col-span-8")}>
                <Popover open={open}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="PLZ oder Stadtnamen eingeben…"
                          className="text-base pe-14"
                          type="text"
                          onChangeCapture={(e) => void handleChange(e)}
                        />
                        {query !== "" ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "absolute top-0 right-1 hover:bg-inherit"
                            )}
                            onClick={() => {
                              setQuery("");
                              form.resetField(field.name);
                            }}
                          >
                            <i className="material-symbols-outlined md-s bold text-contrast-semidark">
                              close
                            </i>
                          </Button>
                        ) : (
                          <i
                            className={cn(
                              "absolute right-2 material-symbols-outlined bold text-contrast-semidark top-2"
                            )}
                          >
                            search
                          </i>
                        )}
                      </div>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onInteractOutside={() => {
                      void setOpen(false);
                    }}
                    className={cn("w-full max-w-[400px] min-w-64 p-0")}
                  >
                    <div className="px-2 py-4 text-base">
                      {loadingSearch ? (
                        <div className="flex flex-row items-center gap-3">
                          <ProgressBar
                            progress={50}
                            spinner={true}
                            style="bold"
                            className="w-6"
                          />
                          <span>Suche Einträge...</span>
                        </div>
                      ) : (
                        <div>
                          {zipCodes && zipCodes?.length > 0 ? (
                            <ul>
                              {zipCodes.map((code) => {
                                return (
                                  <li
                                    key={`zip_search_item_${code.id}`}
                                    className="hover:bg-contrast-light cursor-pointer py-1 px-2"
                                    onClick={() => handleClick(code.id)}
                                  >
                                    {code.name} ({code.postalCode})
                                  </li>
                                );
                              })}
                              {zipCodes.length === searchLimit && (
                                <li className="py-1 px-2">…</li>
                              )}
                            </ul>
                          ) : (
                            <div>Keine Einträge gefunden</div>
                          )}
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div
                className={cn(
                  style.SettingsFormMessage,
                  "ms-3 mt-1 text-danger-high"
                )}
              >
                {Object.keys(form.formState.errors).length > 0 &&
                  "Bitte wählen Sie eine Adresse aus."}
              </div>
            </FormItem>
          )}
        />
        <Separator className="my-2" />
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormControl>
              <Input {...field} type="hidden" readOnly={true} />
            </FormControl>
          )}
        />
        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem className={cn(style.SettingsFormItem)}>
              <FormLabel className={cn(style.SettingsFormLabel)}>PLZ</FormLabel>
              <FormControl className={cn(style.SettingsFormControl)}>
                <div>
                  <Input {...field} type="hidden" readOnly={true} />
                  {loadingAddress ? (
                    <div className="flex flex-row items-center gap-3">
                      <ProgressBar
                        progress={50}
                        spinner={true}
                        style="bold"
                        className="w-6"
                      />
                      <span>Lade Daten...</span>
                    </div>
                  ) : (
                    <span
                      className={cn(
                        field.value === "" && "text-tc-muted",
                        "text-base"
                      )}
                    >
                      {field.value === "" ? "Keine Angaben" : field.value}
                    </span>
                  )}
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="town"
          render={({ field }) => (
            <FormItem className={cn(style.SettingsFormItem)}>
              <FormLabel className={cn(style.SettingsFormLabel)}>
                Stadt
              </FormLabel>
              <FormControl className={cn(style.SettingsFormControl)}>
                <span>
                  <Input {...field} type="hidden" readOnly={true} />
                  {loadingAddress ? (
                    <div className="flex flex-row items-center gap-3">
                      <ProgressBar
                        progress={50}
                        spinner={true}
                        style="bold"
                        className="w-6"
                      />
                      <span>Lade Daten...</span>
                    </div>
                  ) : (
                    <span
                      className={cn(
                        field.value === "" && "text-tc-muted",
                        "text-base"
                      )}
                    >
                      {field.value === "" ? "Keine Angaben" : field.value}
                    </span>
                  )}
                </span>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="county"
          render={({ field }) => (
            <FormItem className={cn(style.SettingsFormItem)}>
              <FormLabel className={cn(style.SettingsFormLabel)}>
                Kreis
              </FormLabel>
              <FormControl className={cn(style.SettingsFormControl)}>
                <span>
                  <Input
                    {...field}
                    className="text-base"
                    type="hidden"
                    readOnly={true}
                  />
                  {loadingAddress ? (
                    <div className="flex flex-row items-center gap-3">
                      <ProgressBar
                        progress={50}
                        spinner={true}
                        style="bold"
                        className="w-6"
                      />
                      <span>Lade Daten...</span>
                    </div>
                  ) : (
                    <span
                      className={cn(
                        field.value === "" && "text-tc-muted",
                        "text-base"
                      )}
                    >
                      {field.value === "" ? "Keine Angaben" : field.value}
                    </span>
                  )}
                </span>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="federalState"
          render={({ field }) => (
            <FormItem className={cn(style.SettingsFormItem)}>
              <FormLabel className={cn(style.SettingsFormLabel)}>
                Bundesland
              </FormLabel>
              <FormControl className={cn(style.SettingsFormControl)}>
                <span>
                  <Input
                    {...field}
                    className="text-base"
                    type="hidden"
                    readOnly={true}
                  />
                  {loadingAddress ? (
                    <div className="flex flex-row items-center gap-3">
                      <ProgressBar
                        progress={50}
                        spinner={true}
                        style="bold"
                        className="w-6"
                      />
                      <span>Lade Daten...</span>
                    </div>
                  ) : (
                    <span
                      className={cn(
                        field.value === "" && "text-tc-muted",
                        "text-base"
                      )}
                    >
                      {field.value === "" ? "Keine Angaben" : field.value}
                    </span>
                  )}
                </span>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem className={cn(style.SettingsFormItem)}>
              <FormLabel className={cn(style.SettingsFormLabel)}>
                Land
              </FormLabel>
              <FormControl className={cn(style.SettingsFormControl)}>
                <span>
                  <Input
                    {...field}
                    className="text-base"
                    type="hidden"
                    readOnly={true}
                  />
                  {loadingAddress ? (
                    <div className="flex flex-row items-center gap-3">
                      <ProgressBar
                        progress={50}
                        spinner={true}
                        style="bold"
                        className="w-6"
                      />
                      <span>Lade Daten...</span>
                    </div>
                  ) : (
                    <span
                      className={cn(
                        field.value === "" && "text-tc-muted",
                        "text-base"
                      )}
                    >
                      {field.value === "" ? "Keine Angaben" : field.value}
                    </span>
                  )}
                </span>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="w-full flex justify-start mb-[-20px] mt-4">
          <div
            onClick={handleClearForm()}
            className="flex flex-row align-middle items-center inline-link cursor-pointer"
          >
            <i className="material-symbols-outlined md-s me-1">delete</i>
            Alle Angaben löschen
          </div>
        </div>
        <SettingsFormError
          state={state}
          className={cn(style.SettingsFormError)}
        />
        <SettingsFooter ref={submitRef} />
      </form>
    </Form>
  );
};

export default SectionCompanyAddressForm;
