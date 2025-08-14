import { Alert, AlertDescription } from "@/components/ui/alert";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createAlias } from "@/lib/actions/assets.action";
import { handleSSRFormReturn } from "@/lib/formHelpers";
import { createAliasSchema } from "@/lib/schemes/assets.schemes";
import { cn } from "@/lib/utils";
import { CustomFormState } from "@/types";
import { Asset, AssetInstance } from "@/types/assistant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const AddAliasForm = ({
  asset,
  active,
  refresh,
}: {
  asset: Asset;
  active: boolean;
  refresh: (instance: AssetInstance | undefined) => void;
}) => {
  const [addAliasDialogOpen, setAddAliasDialogOpen] = useState(false);

  const [state, formAction] = useActionState(
    createAlias,
    {} as CustomFormState
  );

  const form = useForm<z.infer<typeof createAliasSchema>>({
    resolver: zodResolver(createAliasSchema),
    mode: "onChange",
    defaultValues: {
      alias: "",
      componentId: asset.id,
      ...(state?.fields ?? {}),
    },
  });

  useEffect(() => {
    handleSSRFormReturn(
      form,
      state,
      createAliasSchema,
      true,
      "message",
      state.message
    );
    if (state.success) {
      setAddAliasDialogOpen(false);
      refresh((state.payload as AssetInstance) || undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, state]);

  return (
    <Dialog
      open={addAliasDialogOpen}
      onOpenChange={(open) => setAddAliasDialogOpen(open)}
    >
      <DialogTrigger asChild>
        <Button
          className="button-success justify-center align-middle max-sm:w-full"
          disabled={!active}
          aria-disabled={!active}
        >
          <i className="material-symbols-outlined md-s bold me-1">add</i>
          Alias Namen anlegen
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="font-semibold text-lg">
            Neuen Alias-Namen vergeben
          </DialogTitle>
          <DialogDescription className="text-base">
            {`Falls Sie mehrere konkrete Hard- oder Softwareprodukte vom Typ ${asset.name} besitzen, können Sie jeweils einen eigene
        Alias-Namen für die einzelen Produkte vergeben.`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form action={formAction}>
            <FormField
              control={form.control}
              name="alias"
              render={({ field }) => (
                <FormItem className="py-4">
                  <div className=" flex flex-row items-center gap-4 max-sm:flex-col">
                    <FormLabel className={cn("text-base min-w-[100px]")}>
                      Alias-Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="z.B. Notebook-Empfang"
                        {...field}
                        className="text-base"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-base" />
                  {!state.success &&
                    state?.message &&
                    state?.message !== "" && (
                      <div>
                        <Alert
                          variant="destructive"
                          className="flex flex-row gap-4 items-center"
                        >
                          <i className="material-symbols-outlined">warning</i>
                          <AlertDescription className="text-base">
                            {state.message}
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="componentId"
              render={({ field }) => (
                <input {...field} value={asset.id} type="hidden" />
              )}
            />
            <DialogFooter className="flex flex-row max-sm:flex-col gap-2 justify-end">
              <Button className="button-success justify-center align-middle">
                Alias-Namen anlegen
              </Button>
              <DialogClose asChild>
                <Button className="button text-base">Abbrechen</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAliasForm;
