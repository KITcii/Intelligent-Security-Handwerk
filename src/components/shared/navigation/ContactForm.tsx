"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { sendContactForm } from "@/lib/actions/contact.action";
import { contactFormSchema } from "@/lib/schemes/general.schemes";
import { CustomFormState } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { handleSSRFormReturn } from "@/lib/formHelpers";
import { Checkbox } from "@/components/ui/checkbox";
import ThumbsUpAnimation from "@/components/assistant/shared/ThumbsUpAnimation";

const ContactForm = () => {
  const [state, formAction] = useActionState(
    sendContactForm,
    {} as CustomFormState
  );
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState<boolean>(false);

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      mail: "",
      message: "",
      acceptPrivacy: false,
      ...(state?.fields ?? {}),
    },
  });

  useEffect(() => {
    handleSSRFormReturn(form, state, contactFormSchema, true, "message");
    if (state?.success) {
      form.reset();
      setAcceptPrivacy(false);
      setSubmitted(true);
    }
  }, [form, state]);

  if (!submitted) {
    return (
      <div className="w-full max-w-[600px] sm:mt-8 space-y-10">
        <div>
          <h1 className="text-xl font-semibold mb-6">
            Sie haben Fragen oder Anregungen zum IT-Sicherheitsassistenten?
          </h1>
          <p>
            Wir freuen uns von Ihnen zu hören! Schicken Sie uns eine Nachricht
            und wir antworten so schnell wie möglich.
          </p>
          <p className="mt-4">
            Mit <span className="text-danger-mid">*</span> markierte Felder sind
            Pflichtfelder.
          </p>
        </div>

        <div className="bg-contrast-verylight p-6 mb-10">
          <Form {...form}>
            <form action={formAction} className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      Ihr Name <span className="text-danger-mid">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} className="text-base" />
                    </FormControl>
                    <FormMessage className="text-base" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      E-Mail-Adresse <span className="text-danger-mid">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} className="text-base" />
                    </FormControl>
                    <FormMessage className="text-base" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-base">
                      Ihre Nachricht <span className="text-danger-mid">*</span>
                    </FormLabel>
                    <FormControl className="min-w-38">
                      <Textarea
                        className="w-full h-48 text-base"
                        placeholder="Tragen Sie hier Ihre Nachricht ein."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-base" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="acceptPrivacy"
                render={({ field }) => (
                  <FormItem className="mt-6 flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={acceptPrivacy}
                        onCheckedChange={(e) => {
                          setAcceptPrivacy(e === "indeterminate" ? false : e);
                          form.setValue(
                            "acceptPrivacy",
                            e === "indeterminate" ? false : e
                          );
                        }}
                        className="mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel className="text-base">
                        Zustimmung zur Datenverarbeitung{" "}
                        <span className="text-danger-mid">*</span>
                      </FormLabel>
                      <FormDescription className="text-base">
                        Ich stimme der Verarbeitung meiner personenbezogenen
                        Daten zum Zweck der Bearbeitung dieser Nachricht zu.
                        Gleichzeitig nehme ich die{" "}
                        <Link
                          href="privacy"
                          target="_blank"
                          className="inline-link"
                        >
                          Datenschutzerklärung
                        </Link>{" "}
                        zur Kenntnis. Ich kann meine Zustimmung jederzeit
                        widerrufen.
                      </FormDescription>
                    </div>
                    <Input
                      type="hidden"
                      name={field.name}
                      value={acceptPrivacy ? "true" : "false"}
                    />
                  </FormItem>
                )}
              />
              <div className="w-full mt-6">
                <Button
                  className="button-success text-base max-sm:w-full"
                  type="submit"
                >
                  Nachricht absenden
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full flex flex-col justify-center text-center mb-12">
        <ThumbsUpAnimation />
        <div className="font-bold">Vielen Dank!</div>
        <div>Wir haben Ihre Nachricht erhalten.</div>

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

export default ContactForm;
