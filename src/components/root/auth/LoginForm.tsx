"use client";

import { Input } from "@/components/ui/input";
import React, { useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/shared/PasswordInput";
import { signInSchema } from "@/lib/schemes/authentication.schemes";
import { signIn } from "next-auth/react";
import { CustomFormState } from "@/types";
import { cn } from "@/lib/utils";
import AuthSubmitButton from "./AuthSubmitButton";
import LoginFormErrorMessage from "./LoginFormErrorMessage";
import { handleSSRFormReturn } from "@/lib/formHelpers";
import NoUserAccount from "./NoUserAccount";
import {
  LOGIN_FAILED_ACCOUNT_INACTIVE_MESSAGE,
  LOGIN_FAILED_CREDENTIALS_MESSAGE,
  LOGIN_FAILED_MESSAGE,
  UNKOWN_SERVER_ERROR_MESSAGE,
} from "@/constants/dialog";

const LoginForm = () => {
  const [loginFailed, setLoginFailed] = useState(false);
  const router = useRouter();

  const submitLoginCredentials = async (
    prevState: CustomFormState,
    formData: FormData
  ) => {
    setLoginFailed(false);

    const data = Object.fromEntries(formData);
    const fields: Record<string, string> = {};
    for (const key of Object.keys(data)) {
      if (typeof data[key] === "string") {
        fields[key] = data[key];
      }
    }
    const parse = signInSchema.safeParse(data);
    if (!parse.success) {
      setLoginFailed(true);
      return {
        success: false,
        message: LOGIN_FAILED_MESSAGE,
        fields: fields,
        errors: parse.error.flatten().fieldErrors,
      };
    }

    let newState: CustomFormState = {};
    await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      callbackUrl: "/assistant/dashboard",
      redirect: false,
    })
      .then((response) => {
        if (response) {
          switch (response.status) {
            case 200:
              router.push("/assistant/dashboard");
              break;
            case 401:
              //Unauthorized
              setLoginFailed(true);
              newState = {
                success: false,
                message: LOGIN_FAILED_CREDENTIALS_MESSAGE,
                fields: prevState.fields,
              };
              break;
            case 404:
              //	User is not verified
              setLoginFailed(true);
              newState = {
                success: false,
                message: LOGIN_FAILED_ACCOUNT_INACTIVE_MESSAGE,
                fields: prevState.fields,
              };
              break;
            case 400:
            //Bad Request
            case 500:
            //Failed to log in user
            default:
              setLoginFailed(true);
              newState = {
                success: false,
                message: UNKOWN_SERVER_ERROR_MESSAGE,
                fields: prevState.fields,
              };
              break;
          }
        }
      })
      .catch(() => {
        setLoginFailed(true);
        newState = {
          success: false,
          message: UNKOWN_SERVER_ERROR_MESSAGE,
          fields: prevState.fields,
        };
      });
    return newState;
  };

  const [state, formAction] = useActionState(
    submitLoginCredentials,
    {} as CustomFormState
  );

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      username: "",
      ...(state?.fields ?? {}),
    },
  });

  useEffect(() => {
    handleSSRFormReturn(
      form,
      state,
      signInSchema,
      true,
      "raw",
      LOGIN_FAILED_MESSAGE
    );
  }, [form, state]);

  return (
    <div className="default-page-wrapper flex flex-col gap-12 items-center">
      <div>
        <h1 className="h1-heading w-full text-center">Anmelden</h1>
        <div className="w-full">
          <Form {...form}>
            <form action={formAction} className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={cn(
                        "text-base",
                        loginFailed && "text-danger-high"
                      )}
                    >
                      E-Mail Adresse
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="E-Mail"
                        {...field}
                        type="email"
                        className="text-base"
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage className="text-base" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={cn(
                        "text-base",
                        loginFailed && "text-danger-high"
                      )}
                    >
                      Passwort
                    </FormLabel>
                    <FormControl>
                      <PasswordInput props={field} placeholder="Passwort" />
                    </FormControl>
                    <FormMessage className="text-base" />
                    <Link href="/auth/reminder" className="inline-link">
                      Passwort vergessen?
                    </Link>
                  </FormItem>
                )}
              />
              <LoginFormErrorMessage
                fault={loginFailed}
                message={state.message}
              />
              <AuthSubmitButton
                label="Anmelden"
                labelProgress="Anmeldung läuft..."
              />
            </form>
          </Form>
        </div>
      </div>
      <NoUserAccount />
    </div>
  );
};

export default LoginForm;
