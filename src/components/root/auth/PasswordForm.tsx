"use client";

import PasswordStrengthIndicator from "@/components/assistant/shared/PasswordStrengthIndicator";
import PasswordInput from "@/components/shared/PasswordInput";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/lib/actions/auth.action";
import { handleSSRFormReturn } from "@/lib/formHelpers";
import { setPasswordSchema } from "@/lib/schemes/authentication.schemes";
import { CustomFormState } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FormEvent, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AuthSubmitButton from "./AuthSubmitButton";
import { z } from "zod";

const PasswordForm = ({
  token,
  heading,
  successHeading,
}: {
  token: string;
  heading: string;
  successHeading: string;
}) => {
  const [password, setPassword] = useState<string>("");
  const [resetFailed, setResetFailed] = useState(false);
  const [success, setSuccess] = useState(false);

  const [state, formAction] = useActionState(
    resetPassword,
    {} as CustomFormState
  );
  const form = useForm<z.infer<typeof setPasswordSchema>>({
    resolver: zodResolver(setPasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      passwordConfirm: "",
      token: token,
      ...(state?.fields ?? {}),
    },
  });

  useEffect(() => {
    handleSSRFormReturn(form, state, setPasswordSchema, true);
    if (
      state.success === false &&
      state.message &&
      state.message.length > 0 &&
      state.errors === undefined
    ) {
      setResetFailed(true);
    } else if (state.success === true) {
      setSuccess(true);
    }
  }, [form, state]);

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  };
  return (
    <div>
      <h1 className="h1-heading">{success ? successHeading : heading}</h1>
      <div className="mt-4">
        {success ? (
          <>
            <p>
              Das Passwort wurde erfolgreich gespeichert. Sie können sich ab
              sofort mit Ihrem neuen Passwort anmelden.
            </p>
            <Button className="button-success mt-6 w-full" asChild>
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
            <div className="w-full">
              <Form {...form}>
                <form action={formAction} className="flex flex-col gap-6">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Neues Passwort
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            props={field}
                            onChangeCapture={(e) => handleChange(e)}
                          />
                        </FormControl>
                        <FormMessage className="text-base" />
                        {password && (
                          <PasswordStrengthIndicator password={password} />
                        )}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="passwordConfirm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Neues Passwort wiederholen
                        </FormLabel>
                        <FormControl>
                          <PasswordInput props={field} />
                        </FormControl>
                        <FormMessage className="text-base" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="token"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="hidden"
                            name={field.name}
                            value={token}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {state.success === false &&
                    state.errors &&
                    state.errors["token"] && (
                      <div className="text-danger-high space-y-2">
                        <h2 className="font-semibold">
                          {state.message} Falls das Problem weiterhin besteht,
                          fordern Sie bitte einen{" "}
                          <Link href={"/auth/reminder"} className="inline-link">
                            neuen Link an
                          </Link>
                          .
                        </h2>
                      </div>
                    )}
                  {resetFailed && (
                    <div className="text-danger-high space-y-2">
                      <h2 className="font-semibold">{state.message}</h2>
                    </div>
                  )}

                  <AuthSubmitButton
                    label="Weiter"
                    labelProgress="Bitte warten..."
                  />
                </form>
              </Form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PasswordForm;
