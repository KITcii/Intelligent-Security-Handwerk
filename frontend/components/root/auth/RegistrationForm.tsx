"use client";

import PasswordStrengthIndicator from "@/components/assistant/shared/PasswordStrengthIndicator";
import PasswordInput from "@/components/shared/PasswordInput";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerAccount } from "@/lib/actions/auth.action";
import { registerSchema } from "@/lib/schemes/authentication.schemes";
import { cn } from "@/lib/utils";
import {
  BackendCompanyLocation,
  CustomFormState,
  ZipCodeEntryLight,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FormEvent, useActionState, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";
import style from "./form.module.css";
import ProgressBar from "@/components/shared/ProgressBar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { handleSSRFormReturn } from "@/lib/formHelpers";
import { Skeleton } from "@/components/ui/skeleton";
import BackgroundPanel from "@/components/assistant/shared/BackgroundPanel";
import Combobox from "@/components/shared/Combobox";
import { findZipCodes, getFullZipCode } from "@/lib/api/zipCodes.api";
import AuthSubmitButton from "./AuthSubmitButton";
import { Checkbox } from "@/components/ui/checkbox";
import { CompanySizeClassValues } from "@/constants";
import ProfessionSelect from "@/components/shared/ProfessionSelect";

const RegistrationForm = () => {
  // Password field states
  const [password, setPassword] = useState<string>("");
  // Address field states
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [zipCodes, setZipCodes] = useState<ZipCodeEntryLight[] | undefined>(
    undefined
  );
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [loadingAddress, setLoadingAddress] = useState<boolean>(false);
  const searchLimit = 15;
  const submitRef = useRef<HTMLButtonElement | null>(null);
  // Terms field states
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);

  const [state, formAction] = useActionState(
    registerAccount,
    {} as CustomFormState
  );

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      mails: {
        mail: "",
        mailConfirm: "",
      },
      passwords: {
        password: "",
        passwordConfirm: "",
      },
      name: "",
      locationId: "",
      query: "",
      zipCode: "",
      town: "",
      county: "",
      federalState: "",
      country: "",
      professionId: "",
      acceptTerms: false,
      ...(state?.fields ?? {}),
    },
  });

  useEffect(() => {
    handleSSRFormReturn(
      form,
      state,
      registerSchema,
      true,
      "raw",
      state.message
    );
    if (state?.success) {
      setPassword("");
    }
  }, [form, state]);

  // password functions
  const handlePasswordChange = (event: FormEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  };

  // address functions
  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    setQuery(e.currentTarget.value);
  };

  // handle click on autocomplete search result
  const handleClick = (id: number) => {
    setOpen(false);
    async function fetchData() {
      setLoadingAddress(true);
      await getFullZipCode(id).then(
        (data: BackendCompanyLocation | undefined) => {
          if (data !== undefined) {
            form.setValue("locationId", data?.id.toString() || "");
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

  // clear address form
  const handleClearForm = () => () => {
    form.setValue("locationId", "");
    form.setValue("query", "");
    form.setValue("zipCode", "");
    form.setValue("town", "");
    form.setValue("county", "");
    form.setValue("federalState", "");
    form.setValue("country", "");
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
    <div className="registerFormPageWrapper flex flex-col">
      <div className="w-full text-start mb-6">
        <Link href="/auth/login" className="inline-link">
          <i className="material-symbols-outlined md-s inline-block align-middle me-1">
            arrow_back
          </i>
          <span className="inline-block align-middle inline-link">
            Zurück zur Anmeldung
          </span>
        </Link>
      </div>
      {state?.success ? (
        <div className="flex flex-col mb-8">
          <h1 className="h1-heading">Registrierung erfolgreich</h1>
          <p className="max-w-[60ch]">
            Bitte überprüfen Sie Ihr E-Mail-Postfach und bestätigen Sie Ihre
            E-Mail-Adresse, um Ihr Benutzerkonto zu aktivieren. Sollten Sie
            keine E-Mail erhalten, überprüfen Sie bitte auch Ihren Spam-Ordner.
          </p>
          <div className="w-full mt-6">
            <Button className="button-success max-sm:w-full" asChild>
              <Link href="/auth/login">
                <i className="material-symbols-outlined filled inline-block align-middle me-1">
                  person
                </i>
                <span className="inline-block align-middle ">
                  Benutzeranmeldung
                </span>
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="h1-heading">Neuen Handwerksbetrieb registrieren</h1>
          <p className="text-left mb-4">
            Die Registrierung legt einen neuen Handwerksbetrieb an und erstellt
            gleichzeitig das Benutzerkonto des Hauptbenutzers (üblicherweise den
            Betriebsinhaber). Der Hauptbenutzer kann später weitere Benutzer zum
            Handwerksbetrieb hinzufügen, z.B. Mitarbeitende des Betriebs, welche
            dann ebenfalls den IT-Sicherheitsassistenten verwenden können.
          </p>
          <p>
            <span className={cn(style.Required)}>*</span> Pflichtfeld
          </p>
          <div className="w-full mt-6">
            <Form {...form}>
              <form action={formAction} className="flex flex-col gap-6">
                <div className={cn(style.FormSection)}>
                  <h2 className={cn(style.SectionHeader)}>
                    Hauptbenutzer (Betriebsinhaber)
                  </h2>
                  <div className={cn(style.SectionContent)}>
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={cn(style.FormLabel)}>
                            Vorname<span className={cn(style.Required)}>*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
                              {...field}
                              className="text-base"
                            />
                          </FormControl>
                          <FormMessage className={cn(style.FormMessage)} />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={cn(style.FormLabel)}>
                            Nachname
                            <span className={cn(style.Required)}>*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
                              {...field}
                              className="text-base"
                            />
                          </FormControl>
                          <FormMessage className={cn(style.FormMessage)} />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mails.mail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={cn(style.FormLabel)}>
                            E-Mail-Adresse
                            <span className={cn(style.Required)}>*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
                              {...field}
                              className="text-base"
                            />
                          </FormControl>
                          <FormMessage className={cn(style.FormMessage)} />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mails.mailConfirm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={cn(style.FormLabel)}>
                            E-Mail-Adresse wiederholen
                            <span className={cn(style.Required)}>*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
                              {...field}
                              className="text-base"
                            />
                          </FormControl>
                          <FormMessage className={cn(style.FormMessage)} />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="passwords.password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={cn(style.FormLabel)}>
                            Passwort
                            <span className={cn(style.Required)}>*</span>
                          </FormLabel>
                          <FormControl>
                            <PasswordInput
                              props={field}
                              onChangeCapture={(e) => handlePasswordChange(e)}
                            />
                          </FormControl>
                          <FormMessage className={cn(style.FormMessage)} />
                          {password && (
                            <PasswordStrengthIndicator password={password} />
                          )}
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="passwords.passwordConfirm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={cn(style.FormLabel)}>
                            Passwort wiederholen
                            <span className={cn(style.Required)}>*</span>
                          </FormLabel>
                          <FormControl>
                            <PasswordInput props={field} />
                          </FormControl>
                          <FormMessage className={cn(style.FormMessage)} />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className={cn(style.FormSection)}>
                  <h2 className={cn(style.SectionHeader)}>Handwerksbetrieb</h2>
                  <div className={cn(style.SectionContentWide)}>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={cn(style.FormLabel)}>
                            Name des Betriebes
                            <span className={cn(style.Required)}>*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
                              {...field}
                              className="text-base"
                            />
                          </FormControl>
                          <FormMessage className={cn(style.FormMessage)} />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="query"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={cn(style.FormLabel)}>
                            Region
                          </FormLabel>
                          <FormControl>
                            <Popover open={open}>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      {...field}
                                      placeholder="PLZ oder Stadtnamen eingeben…"
                                      className="text-base pe-14"
                                      type="text"
                                      onChangeCapture={(e) =>
                                        void handleChange(e)
                                      }
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
                                className={cn(
                                  "w-full max-w-[400px] min-w-64 p-0"
                                )}
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
                                                onClick={() =>
                                                  handleClick(code.id)
                                                }
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
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div
                      className={cn(
                        "ms-3",
                        !loadingAddress && !form.getValues("town") && "hidden"
                      )}
                    >
                      <BackgroundPanel>
                        <FormField
                          control={form.control}
                          name="locationId"
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
                            <FormItem className={cn(style.AddressFieldItem)}>
                              <FormLabel className={cn(style.AddressFormLabel)}>
                                PLZ
                              </FormLabel>
                              <FormControl
                                className={cn(style.AddressFormField)}
                              >
                                <div>
                                  <Input
                                    {...field}
                                    className="text-base"
                                    type="hidden"
                                    readOnly={true}
                                  />
                                  {loadingAddress ? (
                                    <Skeleton
                                      className={cn(style.AddresSkeleton)}
                                    />
                                  ) : (
                                    <span
                                      className={cn(
                                        field.value === "" && "text-tc-muted",
                                        "text-base"
                                      )}
                                    >
                                      {field.value === ""
                                        ? "Keine Angaben"
                                        : field.value}
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
                            <FormItem className={cn(style.AddressFieldItem)}>
                              <FormLabel className={cn(style.AddressFormLabel)}>
                                Stadt
                              </FormLabel>
                              <FormControl
                                className={cn(style.AddressFormField)}
                              >
                                <span>
                                  <Input
                                    {...field}
                                    className="text-base"
                                    type="hidden"
                                    readOnly={true}
                                  />
                                  {loadingAddress ? (
                                    <Skeleton
                                      className={cn(style.AddresSkeleton)}
                                    />
                                  ) : (
                                    <span
                                      className={cn(
                                        field.value === "" && "text-tc-muted",
                                        "text-base"
                                      )}
                                    >
                                      {field.value === ""
                                        ? "Keine Angaben"
                                        : field.value}
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
                            <FormItem className={cn(style.AddressFieldItem)}>
                              <FormLabel className={cn(style.AddressFormLabel)}>
                                Kreis
                              </FormLabel>
                              <FormControl
                                className={cn(style.AddressFormField)}
                              >
                                <span>
                                  <Input
                                    {...field}
                                    className="text-base"
                                    type="hidden"
                                    readOnly={true}
                                  />
                                  {loadingAddress ? (
                                    <Skeleton
                                      className={cn(style.AddresSkeleton)}
                                    />
                                  ) : (
                                    <span
                                      className={cn(
                                        field.value === "" && "text-tc-muted",
                                        "text-base"
                                      )}
                                    >
                                      {field.value === ""
                                        ? "Keine Angaben"
                                        : field.value}
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
                            <FormItem className={cn(style.AddressFieldItem)}>
                              <FormLabel className={cn(style.AddressFormLabel)}>
                                Bundesland
                              </FormLabel>
                              <FormControl
                                className={cn(style.AddressFormField)}
                              >
                                <span>
                                  <Input
                                    {...field}
                                    className="text-base"
                                    type="hidden"
                                    readOnly={true}
                                  />
                                  {loadingAddress ? (
                                    <Skeleton
                                      className={cn(style.AddresSkeleton)}
                                    />
                                  ) : (
                                    <span
                                      className={cn(
                                        field.value === "" && "text-tc-muted",
                                        "text-base"
                                      )}
                                    >
                                      {field.value === ""
                                        ? "Keine Angaben"
                                        : field.value}
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
                            <FormItem className={cn(style.AddressFieldItem)}>
                              <FormLabel className={cn(style.AddressFormLabel)}>
                                Land
                              </FormLabel>
                              <FormControl
                                className={cn(style.AddressFormField)}
                              >
                                <span>
                                  <Input
                                    {...field}
                                    className="text-base"
                                    type="hidden"
                                    readOnly={true}
                                  />
                                  {loadingAddress ? (
                                    <Skeleton
                                      className={cn(style.AddresSkeleton)}
                                    />
                                  ) : (
                                    <span
                                      className={cn(
                                        field.value === "" && "text-tc-muted",
                                        "text-base"
                                      )}
                                    >
                                      {field.value === ""
                                        ? "Keine Angaben"
                                        : field.value}
                                    </span>
                                  )}
                                </span>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        {loadingAddress && (
                          <div className="flex flex-row items-center gap-3 mt-8">
                            <ProgressBar
                              progress={50}
                              spinner={true}
                              style="bold"
                              className="w-6"
                            />
                            <span>Lade Addressdaten...</span>
                          </div>
                        )}
                        <div
                          className={cn(
                            style.FormMessage,
                            " mt-1 text-base text-danger-high"
                          )}
                        >
                          {(form.formState.errors["zipCode"] ||
                            form.formState.errors["locationId"] ||
                            form.formState.errors["town"] ||
                            form.formState.errors["county"] ||
                            form.formState.errors["federalState"] ||
                            form.formState.errors["country"]) && (
                            <div className="mt-4">
                              <span className={cn(style.FormMessage)}>
                                Die Eingaben sind fehlerhaft:
                              </span>
                              <ul className="ps-2">
                                {form.formState.errors["zipCode"] && (
                                  <li className="list-disc list-outside ms-3">
                                    {form.formState.errors["zipCode"].message}
                                  </li>
                                )}
                                {form.formState.errors["town"] && (
                                  <li className="list-disc list-outside ms-3">
                                    {form.formState.errors["town"].message}
                                  </li>
                                )}
                                {form.formState.errors["county"] && (
                                  <li className="list-disc list-outside ms-3">
                                    {form.formState.errors["county"].message}
                                  </li>
                                )}
                                {form.formState.errors["federalState"] && (
                                  <li className="list-disc list-outside ms-3">
                                    {
                                      form.formState.errors["federalState"]
                                        .message
                                    }
                                  </li>
                                )}
                                {form.formState.errors["country"] && (
                                  <li className="list-disc list-outside ms-3">
                                    {form.formState.errors["country"].message}
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
                          {!(
                            form.formState.errors["zipCode"] ||
                            form.formState.errors["locationId"] ||
                            form.formState.errors["town"] ||
                            form.formState.errors["county"] ||
                            form.formState.errors["federalState"] ||
                            form.formState.errors["country"]
                          ) &&
                            !loadingAddress &&
                            form.getValues("zipCode") && (
                              <div className="w-full flex flex-between max-sm:flex-col align-middle items-center mt-4 max-sm:content-center max-sm:ms-[-2rem] ">
                                <div
                                  onClick={handleClearForm()}
                                  className="flex flex-row align-middle items-center  cursor-pointer text-tc max-sm:w-full max-sm:text-center max-sm:justify-center"
                                >
                                  <i className="material-symbols-outlined md-s me-1 max-sm:opacity-0">
                                    delete
                                  </i>
                                  <span className="inline-link">
                                    Alle Angaben löschen
                                  </span>
                                </div>

                                <div className="text-highlight-100 max-sm:text-center max-sm:mt-2">
                                  <i className="material-symbols-outlined filled">
                                    check_circle
                                  </i>
                                </div>
                              </div>
                            )}
                        </div>
                      </BackgroundPanel>
                    </div>
                    <FormField
                      control={form.control}
                      name="professionId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={cn(style.FormLabel)}>
                            Handwerksgewerbe
                          </FormLabel>
                          <ProfessionSelect
                            fieldName={field.name}
                            fieldValue={field.value}
                          />
                          <FormMessage className={cn(style.FormMessage)} />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="companyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={cn(style.FormLabel)}>
                            Betriebsgröße
                          </FormLabel>
                          <Combobox
                            placeholder="Betriebsgröße"
                            name={field.name}
                            value={field.value}
                            alignment="start"
                            contextWidth="max-[450px]:max-w-[300px]"
                            allowEmpty={true}
                            data={CompanySizeClassValues.map((ec) => {
                              return { value: ec.id, label: ec.name };
                            })}
                          />
                          <FormMessage className={cn(style.FormMessage)} />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="acceptTerms"
                      render={({ field }) => (
                        <FormItem className="mt-6 flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={acceptTerms}
                              onCheckedChange={(e) => {
                                setAcceptTerms(
                                  e === "indeterminate" ? false : e
                                );
                                form.setValue(
                                  "acceptTerms",
                                  e === "indeterminate" ? false : e
                                );
                              }}
                              className="mt-1"
                            />
                          </FormControl>
                          <div className="space-y-1">
                            <FormLabel className="text-base">
                              Zustimmung zur Datenverarbeitung
                              <span className="text-danger-mid">*</span>
                            </FormLabel>
                            <FormDescription className="text-base">
                              Ich habe die{" "}
                              <Link
                                href="terms"
                                target="_blank"
                                className="inline-link"
                              >
                                allgemeinen Nutzungsbedingungen
                              </Link>{" "}
                              und die{" "}
                              <Link
                                href="privacy"
                                target="_blank"
                                className="inline-link"
                              >
                                Datenschutzerklärung
                              </Link>{" "}
                              des intelligenten IT-Sicherheitsassistenten zur
                              Kenntnis genommen. Zudem stimme ich der
                              Verarbeitung und Speicherung meiner
                              personenbezogenen Daten zum Zwecke der
                              Bereitstellung der oben genannten Anwendung /
                              Dienstleistung zu. Ich kann meine Zustimmung
                              jederzeit widerrufen.
                            </FormDescription>
                            <FormMessage className={cn(style.FormMessage)} />
                          </div>
                          <Input
                            type="hidden"
                            name={field.name}
                            value={acceptTerms ? "true" : "false"}
                          />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="w-full flex justify-end">
                  <AuthSubmitButton
                    label="Weiter"
                    labelProgress="Bitte warten..."
                    className="button-success w-full sm:w-fit"
                  />
                </div>
              </form>
            </Form>
          </div>
        </>
      )}
    </div>
  );
};

export default RegistrationForm;
