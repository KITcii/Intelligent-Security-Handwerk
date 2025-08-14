"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteCompany } from "@/lib/actions/company.action";
import { deleteCompanySchema } from "@/lib/schemes/settings.schemes";
import { CustomFormState } from "@/types";
import { BackendCompany } from "@/types/assistant";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FORM_UPDATE_ERROR } from "@/constants/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ThumbsUpAnimation from "../../shared/ThumbsUpAnimation";
import FormDialogPendingWrapper from "../shared/FormDialogPendingWrapper";
import { signOut } from "next-auth/react";

const SectionCompanyDeleteForm = ({
  stateData,
}: {
  stateData: BackendCompany | undefined;
}) => {
  const [state, formAction] = useActionState(
    deleteCompany,
    {} as CustomFormState
  );

  const [deleted, setDeleted] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof deleteCompanySchema>>({
    resolver: zodResolver(deleteCompanySchema),
    values: {
      companyID: stateData?.id ?? "",
    },
    defaultValues: {
      companyID: stateData?.id,
      ...(state?.fields ?? {}),
    },
  });

  useEffect(() => {
    if (state?.success) {
      setDeleted(true);
      setTimeout(() => {
        signOut().catch(() => {
          router.push("/");
        });
      }, 3000);
    } else if (state?.success !== undefined) {
      toast.error(state.message || FORM_UPDATE_ERROR);
    }
  }, [form, router, state]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="flex justify-end">
          <Button className="button-danger w-fit text-base">
            <i className="material-symbols-outlined me-2">delete</i>
            Betrieb löschen
          </Button>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <Form {...form}>
          <form action={formAction}>
            <FormField
              control={form.control}
              name="companyID"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="hidden" {...field} className="text-base" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormDialogPendingWrapper text="Betrieb wird gelöscht">
              {deleted ? (
                <div className="flex flex-col items-center gap-5">
                  <ThumbsUpAnimation />
                  <div className="font-semibold">
                    Der Betrieb wurde erfolgreich gelöscht.
                  </div>
                </div>
              ) : state?.success === false ? (
                <>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Löschung des Betriebs ist fehlgeschlagen!
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
                    <AlertDialogDescription className="text-base">
                      Die Löschung des Betriebes{" "}
                      <b>kann nicht rückgängig gemacht werden</b>. Alle
                      eigegebenen Daten zu Ihrem Betrieb (u. a. Ihre
                      IT-Infrastruktur), alle Benutzerkonten, Ihr
                      Eigentümerkonto und alle damit verbundenen Daten werden
                      dauerhaft von unseren Servern gelöscht.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-8">
                    <AlertDialogCancel asChild>
                      <Button className="button">Abbrechen</Button>
                    </AlertDialogCancel>
                    <Button className="button-danger" type="submit">
                      <i className="material-symbols-outlined me-2">delete</i>
                      Betrieb löschen
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

export default SectionCompanyDeleteForm;
