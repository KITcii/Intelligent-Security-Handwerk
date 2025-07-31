"use client";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Separator } from "@/components/ui/separator";
import { createUserSchema } from "@/lib/schemes/settings.schemes";
import { createUser } from "@/lib/actions/user.action";
import { CustomFormState } from "@/types";
import FormDialogPendingWrapper from "../shared/FormDialogPendingWrapper";
import { useActionState, useEffect, useState } from "react";
import ThumbsUpAnimation from "../../shared/ThumbsUpAnimation";
import { handleSSRFormReturn } from "@/lib/formHelpers";
import SettingsFormError from "../shared/SettingsFormError";

const SettingsAddUserForm = () => {
  const [state, formAction] = useActionState(createUser, {} as CustomFormState);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof createUserSchema>>({
    mode: "onChange",
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      mail: "",
      mailConfirm: "",
      ...(state?.fields ?? {}),
    },
  });

  const handleClose = (open: boolean) => {
    if (!open) {
      handleReset();
    }
  };

  const handleReset = () => {
    form.reset();
    setSubmitted(false);
  };

  useEffect(() => {
    handleSSRFormReturn(form, state, createUserSchema, true, "add");
    if (state?.success) {
      setSubmitted(true);
    }
  }, [form, state]);

  return (
    <Dialog onOpenChange={(open) => handleClose(open)}>
      <DialogTrigger asChild>
        <Button className="text-base button-success">
          <i className="material-symbols-outlined md-s bold me-2">add</i>
          Neuen Benutzer anlegen
        </Button>
      </DialogTrigger>
      <DialogContent
        onEscapeKeyDown={(e) => {
          void e.preventDefault();
        }}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Form {...form}>
          <form action={formAction} className={cn(style.SettingsForm)}>
            <FormDialogPendingWrapper text="Einladung wird versendet">
              {submitted ? (
                <div className="flex flex-col items-center gap-5">
                  <ThumbsUpAnimation />
                  <div className="text-center">
                    <p className="font-semibold">
                      Das Benutzerkonto wurde erfolgreich angelegt.
                    </p>
                    <p className="mt-4">
                      Eine E-Mail mit Informationen zur Aktivierung des
                      Benuzterkontos wurde an die E-Mail-Adresse{" "}
                      <b>{state?.fields?.mail}</b> versendet.
                    </p>
                  </div>
                  <DialogFooter className="mt-6">
                    <DialogClose asChild>
                      <Button className="text-base button">
                        <i className="material-symbols-outlined me-2">close</i>
                        Schließen
                      </Button>
                    </DialogClose>
                    <Button
                      className="text-base button-success"
                      onClickCapture={handleReset}
                    >
                      <i className="material-symbols-outlined md-s bold me-2">
                        add
                      </i>
                      Weiteren Benutzer anlegen
                    </Button>
                  </DialogFooter>
                </div>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle>Neuen Benutzer anlegen</DialogTitle>
                    <DialogDescription className="text-base">
                      Um einen neuen Benutzer ihrem Betrieb hinzuzufügen, geben
                      Sie bitte den Namen und die E-Mail-Adresse des neuen
                      Benutzers an. Das System versendet im Anschluss eine
                      E-Mail an die angegebene Adresse mit Informationen zur
                      Aktivierung des neuen Benutzerkontos.
                    </DialogDescription>
                  </DialogHeader>
                  <Separator className="my-5" />
                  <div className="flex flex-col gap-3 my-10">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className={cn(style.SettingsFormItem)}>
                          <FormLabel
                            className={cn(style.SettingsFormLabelWide)}
                          >
                            Vorname
                          </FormLabel>
                          <FormControl
                            className={cn(style.SettingsFormControlWide)}
                          >
                            <Input
                              placeholder=""
                              {...field}
                              className="text-base"
                            />
                          </FormControl>
                          <FormMessage
                            className={cn(style.SettingsFormMessageWide)}
                          />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem className={cn(style.SettingsFormItem)}>
                          <FormLabel
                            className={cn(style.SettingsFormLabelWide)}
                          >
                            Nachname
                          </FormLabel>
                          <FormControl
                            className={cn(style.SettingsFormControlWide)}
                          >
                            <Input
                              placeholder=""
                              {...field}
                              className="text-base"
                            />
                          </FormControl>
                          <FormMessage
                            className={cn(style.SettingsFormMessageWide)}
                          />
                        </FormItem>
                      )}
                    />
                    <Separator className="my-1 bg-transparent" />
                    <FormField
                      control={form.control}
                      name="mail"
                      render={({ field }) => (
                        <FormItem className={cn(style.SettingsFormItem)}>
                          <FormLabel
                            className={cn(style.SettingsFormLabelWide)}
                          >
                            E-Mail
                          </FormLabel>
                          <FormControl
                            className={cn(style.SettingsFormControlWide)}
                          >
                            <Input
                              placeholder=""
                              {...field}
                              className="text-base"
                            />
                          </FormControl>
                          <FormMessage
                            className={cn(style.SettingsFormMessageWide)}
                          />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mailConfirm"
                      render={({ field }) => (
                        <FormItem className={cn(style.SettingsFormItem)}>
                          <FormLabel
                            className={cn(style.SettingsFormLabelWide)}
                          >
                            E-Mail wiederholen
                          </FormLabel>
                          <FormControl
                            className={cn(style.SettingsFormControlWide)}
                          >
                            <Input
                              placeholder=""
                              {...field}
                              className="text-base"
                            />
                          </FormControl>
                          <FormMessage
                            className={cn(style.SettingsFormMessageWide)}
                          />
                        </FormItem>
                      )}
                    />
                    <SettingsFormError
                      state={state}
                      className={cn(style.SettingsFormError)}
                    />
                  </div>
                  <Separator className="my-5" />
                  <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    <DialogClose asChild>
                      <Button type="button" className="button text-base">
                        Abbrechen
                      </Button>
                    </DialogClose>
                    <Button type="submit" className="button-success text-base">
                      <i className="material-symbols-outlined md-s bold me-2">
                        add
                      </i>
                      Benutzer anlegen
                    </Button>
                  </DialogFooter>
                </>
              )}
            </FormDialogPendingWrapper>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsAddUserForm;
