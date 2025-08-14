"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { reminderSchema } from "@/lib/schemes/authentication.schemes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitPasswordResetRequest } from "@/lib/actions/auth.action";
import { z } from "zod";
import { useActionState, useEffect, useState } from "react";
import AuthSubmitButton from "./AuthSubmitButton";
import { Button } from "@/components/ui/button";
import NoUserAccount from "./NoUserAccount";

const PasswordReminderForm = () => {
  const [reminderFailed, setReminderFailed] = useState(false);
  const [success, setSuccess] = useState(false);

  const [state, formAction] = useActionState(submitPasswordResetRequest, {
    success: false,
    message: "",
  });
  const form = useForm<z.infer<typeof reminderSchema>>({
    resolver: zodResolver(reminderSchema),
    mode: "onChange",
    defaultValues: {
      mail: "",
      ...(state?.fields ?? {}),
    },
  });

  useEffect(() => {
    if (state.success === false && state.message && state.message.length > 0) {
      setReminderFailed(true);
    } else if (state.success === true) {
      setSuccess(true);
    }
  }, [form, state]);

  return (
    <div className="default-page-wrapper flex flex-col">
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
      <h1 className="h1-heading">
        {success ? "Anfrage erfolgreich versendet" : "Passwort zurücksetzen"}
      </h1>

      <div className="flex flex-col gap-6">
        {success ? (
          <>
            <p>
              Falls ein Benutzerkonto unter der angegebenen E-Mail Adresse
              existiert, erhalten Sie in den nächsten Minuten einen Link per
              E-Mail. Falls die E-Mail nicht ankommt, überprüfen Sie bitte Ihren
              Spam-Ordner.
            </p>
            <Button className="button-success mb-6" asChild>
              <Link href="/auth/login">
                <i className="material-symbols-outlined filled inline-block align-middle me-1">
                  person
                </i>
                <span className="inline-block align-middle ">
                  Benutzeranmeldung
                </span>
              </Link>
            </Button>
          </>
        ) : (
          <>
            <p>
              Um ein neues Passwort zu vergeben, tragen Sie bitte die
              E-Mail-Adresse ein, die Sie zur Anmeldung Ihres Benutzerkontos
              verwendet haben. Wenn ein Konto mit dieser E-Mail Adresse
              existiert, erhalten Sie einen Link zum Zurücksetzen Ihres
              Passworts.
            </p>
            <div className="w-full">
              <Form {...form}>
                <form action={formAction} className="flex flex-col gap-6">
                  <FormField
                    control={form.control}
                    name="mail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className={cn(
                            "text-base",
                            reminderFailed && "text-danger-high"
                          )}
                        >
                          E-Mail Adresse
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="z. B. betrieb@example.com"
                            {...field}
                            type="email"
                            className="text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {reminderFailed && (
                    <div className="text-danger-high space-y-2">
                      <h2 className="font-semibold">{state.message}</h2>
                    </div>
                  )}
                  <AuthSubmitButton
                    label="Passwort zurücksetzen"
                    labelProgress="Bitte warten..."
                  />
                </form>
              </Form>
            </div>
          </>
        )}
        <NoUserAccount />
      </div>
    </div>
  );
};

export default PasswordReminderForm;
