"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { deleteAccount } from "@/lib/actions/user.action";
import { deleteUserAccountSchema } from "@/lib/schemes/settings.schemes";
import { CustomFormState } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { FORM_UPDATE_ERROR } from "@/constants/dialog";
import { useRouter } from "next/navigation";
import ThumbsUpAnimation from "../../shared/ThumbsUpAnimation";
import FormDialogPendingWrapper from "./FormDialogPendingWrapper";
import { signOut } from "next-auth/react";

const DeleteAccountForm = ({
  userID,
  redirect,
  children,
}: {
  userID: string;
  redirect: boolean;
  children: React.ReactNode;
}) => {
  const [state, formAction] = useActionState(
    deleteAccount,
    {} as CustomFormState
  );

  const [deleted, setDeleted] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof deleteUserAccountSchema>>({
    resolver: zodResolver(deleteUserAccountSchema),
    values: {
      userID: userID,
    },
    defaultValues: {
      userID: userID,
      ...(state?.fields ?? {}),
    },
  });

  useEffect(() => {
    if (state?.success) {
      setDeleted(true);
      if (redirect) {
        setTimeout(() => {
          signOut().catch(() => {
            router.push("/");
          });
        }, 3000);
      }
    } else if (state?.success !== undefined) {
      toast.error(FORM_UPDATE_ERROR);
    }
  }, [form, redirect, router, state]);

  return (
    <AlertDialog>
      {children}
      <AlertDialogContent
        onEscapeKeyDown={(e) => {
          void e.preventDefault();
        }}
      >
        <Form {...form}>
          <form action={formAction}>
            <FormField
              control={form.control}
              name="userID"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="hidden" {...field} className="text-base" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormDialogPendingWrapper text="Benutzeraccount wird gelöscht">
              {deleted ? (
                <div className="flex flex-col items-center gap-5">
                  <ThumbsUpAnimation />
                  <div className="font-semibold">
                    Das Benutzerkonto wurde erfolgreich gelöscht.
                  </div>
                  {redirect ? (
                    <></>
                  ) : (
                    <AlertDialogCancel asChild>
                      <Button className="text-base button">
                        <i className="material-symbols-outlined me-2">close</i>
                        Fenster schließen
                      </Button>
                    </AlertDialogCancel>
                  )}
                </div>
              ) : state?.success === false ? (
                <>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Löschung des Benutzerkontos ist fehlgeschlagen!
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base">
                      {state.message}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-8">
                    <AlertDialogCancel asChild>
                      <Button className="button">Abbrechen</Button>
                    </AlertDialogCancel>
                    <Button className="button-danger" type="submit">
                      <i className="material-symbols-outlined me-2">refresh</i>
                      Erneut versuchen
                    </Button>
                  </AlertDialogFooter>
                </>
              ) : (
                <>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Sind Sie sich absolut sicher?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base ">
                      Die Löschung des Benutzerkontos{" "}
                      <b>kann nicht rückgängig gemacht werden</b>. Das
                      Benutzerkonto und alle damit verbundenen Daten werden
                      dauerhaft von unseren Servern gelöscht.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-8">
                    <AlertDialogCancel asChild>
                      <Button className="button">Abbrechen</Button>
                    </AlertDialogCancel>
                    <Button className="button-danger" type="submit">
                      <i className="material-symbols-outlined me-2">delete</i>
                      Benutzerkonto löschen
                    </Button>
                  </AlertDialogFooter>
                </>
              )}
            </FormDialogPendingWrapper>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccountForm;
