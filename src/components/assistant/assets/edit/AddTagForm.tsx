"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { createOrAddAliasTag } from "@/lib/actions/assets.action";
import { handleSSRFormReturn } from "@/lib/formHelpers";
import { createTagSchema } from "@/lib/schemes/assets.schemes";
import { CustomFormState } from "@/types";
import { AssetInstance, ComponentAlias } from "@/types/assistant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AddTagButton from "./AddTagButton";

const AddTagForm = ({
  alias,
  refresh,
}: {
  alias: ComponentAlias;
  refresh: (instance: AssetInstance | undefined) => void;
}) => {
  const [state, formAction] = useActionState(
    createOrAddAliasTag,
    {} as CustomFormState
  );

  const form = useForm<z.infer<typeof createTagSchema>>({
    resolver: zodResolver(createTagSchema),
    mode: "onChange",
    defaultValues: {
      tag: "",
      instanceId: alias.instanceId,
      ...(state?.fields ?? {}),
    },
  });

  useEffect(() => {
    handleSSRFormReturn(
      form,
      state,
      createTagSchema,
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
      <div className="font-semibold mb-2">Neuen Tag hinzufügen</div>
      <Form {...form}>
        <form action={formAction} className="flex flex-col gap-2">
          <div className="flex flex-row gap-2">
            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Neuer Tag-Name..."
                      {...field}
                      className="text-base"
                    />
                  </FormControl>
                  <FormMessage className="text-base" />
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
            <AddTagButton />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddTagForm;
