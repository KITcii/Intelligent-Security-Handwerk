import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateAliasName } from "@/lib/actions/assets.action";
import { handleSSRFormReturn } from "@/lib/formHelpers";
import { updateAliasSchema } from "@/lib/schemes/assets.schemes";
import { CustomFormState } from "@/types";
import { AssetInstance, ComponentAlias } from "@/types/assistant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SubmitFormButton from "./SubmitFormButton";

const RenameAliasForm = ({
  alias,
  refresh,
}: {
  alias: ComponentAlias;
  refresh: (instance: AssetInstance | undefined) => void;
}) => {
  const [state, formAction] = useActionState(
    updateAliasName,
    {} as CustomFormState
  );

  const form = useForm<z.infer<typeof updateAliasSchema>>({
    resolver: zodResolver(updateAliasSchema),
    mode: "onChange",
    defaultValues: {
      alias: "",
      instanceId: alias.instanceId,
      ...(state?.fields ?? {}),
    },
  });

  useEffect(() => {
    handleSSRFormReturn(
      form,
      state,
      updateAliasSchema,
      true,
      "message",
      state.message
    );
    if (state.success) {
      refresh((state.payload as AssetInstance) || undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, state]);

  return (
    <div className="flex flex-col gap-2">
      <Form {...form}>
        <form action={formAction}>
          <FormField
            control={form.control}
            name="alias"
            render={({ field }) => (
              <FormItem className="py-4">
                <div className="flex flex-col gap-2">
                  <FormLabel className="text-base font-semibold">
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
                {!state.success && state?.message && state?.message !== "" && (
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
            name="instanceId"
            render={({ field }) => (
              <input {...field} value={alias.instanceId} type="hidden" />
            )}
          />
          <SubmitFormButton />
        </form>
      </Form>
    </div>
  );
};

export default RenameAliasForm;
