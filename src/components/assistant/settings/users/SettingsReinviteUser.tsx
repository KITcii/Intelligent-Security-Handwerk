"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ReinviteButton from "./ReinviteButton";
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
import ThumbsUpAnimation from "../../shared/ThumbsUpAnimation";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CustomFormState } from "@/types";
import { inviteUserSchema } from "@/lib/schemes/settings.schemes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import FormDialogPendingWrapper from "../shared/FormDialogPendingWrapper";
import { sendUserInvitation } from "@/lib/actions/user.action";
import { useActionState, useEffect, useRef } from "react";
import { FORM_SUBMIT_ERROR_UNKNOWN } from "@/constants/dialog";
import { toast } from "sonner";

const SettingsReinviteUser = ({ userID }: { userID: string }) => {
  const [state, formAction] = useActionState(
    sendUserInvitation,
    {} as CustomFormState
  );

  const form = useForm<z.infer<typeof inviteUserSchema>>({
    resolver: zodResolver(inviteUserSchema),
    values: {
      userID: userID,
    },
    defaultValues: {
      userID: userID,
      ...(state?.fields ?? {}),
    },
  });

  useEffect(() => {
    if (state?.success !== undefined && !state?.success) {
      toast.error(FORM_SUBMIT_ERROR_UNKNOWN);
    }
  }, [form, state]);

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Form {...form}>
      <form ref={formRef} action={formAction}>
        <FormField
          control={form.control}
          name="userID"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="hidden" {...field} className="text-base" />
              </FormControl>
            </FormItem>
          )}
        />
        <AlertDialog>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <div className="flex justify-end">
                    <ReinviteButton />
                  </div>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent className="text-base">
                Einladung erneut senden
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <AlertDialogContent>
            <FormDialogPendingWrapper text="Benutzereinladung wird erneut versendet">
              {state?.success === true ? (
                <div className="flex flex-col items-center gap-5">
                  <ThumbsUpAnimation />
                  <div className="font-semibold">
                    Die Benutzereinladung wurde erfolgreich versendet.
                  </div>
                  <AlertDialogCancel asChild>
                    <Button className="text-base button">
                      <i className="material-symbols-outlined me-2">close</i>
                      Fenster schließen
                    </Button>
                  </AlertDialogCancel>
                </div>
              ) : (
                <>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-danger-high">
                      Versand der Benutzereinladung ist fehlgeschlagen!
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base">
                      {state.message}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-8">
                    <AlertDialogCancel asChild>
                      <Button className="button">Abbrechen</Button>
                    </AlertDialogCancel>
                    <Button
                      className="button-success"
                      type="submit"
                      onClick={() => {
                        if (formRef.current) {
                          formRef.current.dispatchEvent(
                            new Event("submit", { bubbles: true })
                          );
                        }
                      }}
                    >
                      <i className="material-symbols-outlined me-2">refresh</i>
                      Erneut versuchen
                    </Button>
                  </AlertDialogFooter>
                </>
              )}
            </FormDialogPendingWrapper>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </Form>
  );
};

export default SettingsReinviteUser;
