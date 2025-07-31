import {
  FORM_SUBMIT_ERROR_MESSAGE,
  FORM_SUBMIT_ERROR_UNKNOWN,
  FORM_SUBMIT_SUCCESS_GENERAL,
  FORM_UPDATE_ERROR,
  FORM_UPDATE_SUCCESS,
} from "@/constants/dialog";
import { CustomFormState } from "@/types";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { ZodSchema } from "zod";

export type ZodSchemaFields = { [K: string]: ZodSchemaFields | true };

// handle form response in client
export const handleSSRFormReturn = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>,
  state: CustomFormState,
  schema: ZodSchema,
  clearForm: boolean = false,
  variant: "update" | "add" | "message" | "raw" = "update",
  rawMessage?: string
) => {
  form.clearErrors();
  if (state?.success) {
    if (clearForm) {
      form.reset();
    }

    toast.success(
      state.message
        ? state.message
        : variant === "update"
          ? FORM_UPDATE_SUCCESS
          : variant === "add"
            ? FORM_SUBMIT_SUCCESS_GENERAL
            : FORM_UPDATE_SUCCESS
    );
  } else if (state?.success !== undefined) {
    toast.error(
      variant === "raw"
        ? rawMessage || state.message
        : variant === "update"
          ? FORM_UPDATE_ERROR
          : variant === "add"
            ? FORM_SUBMIT_ERROR_UNKNOWN
            : variant === "message"
              ? FORM_SUBMIT_ERROR_MESSAGE
              : FORM_UPDATE_ERROR
    );
    if (
      state !== undefined &&
      state.errors !== undefined &&
      Object.keys(state.errors).length > 0
    ) {
      const fields = getZodSchemaFieldsV(schema);

      const getCompoundFields = (fields: ZodSchemaFields): string[] => {
        const compoundFields: string[] = [];
        Object.keys(fields).forEach((field) => {
          if (fields[field] === true) {
            compoundFields.push(field);
          } else {
            getCompoundFields(fields[field]).forEach((f) =>
              compoundFields.push(`${field}.${f}`)
            );
          }
        });
        return compoundFields;
      };

      const processedFields = getCompoundFields(fields);

      processedFields.forEach((field) => {
        if (
          state.errors !== undefined &&
          Object.hasOwn(state.errors, field) &&
          Array.isArray(state.errors[field])
        ) {
          state.errors[field].forEach((error) => {
            form.setError(field, { message: error });
          });
        }
      });
    }
  }
};

// extract field names from zod schema
export function getZodSchemaFields(schema: ZodSchema): string[] {
  type DirtyZodSchemaFields = { [K: string]: DirtyZodSchemaFields };

  const fields = {};

  const _proxyHandler = {
    get(fields: { [K: string]: DirtyZodSchemaFields }, key: string | symbol) {
      if (key === "then" || typeof key !== "string") {
        return;
      }
      if (!fields[key]) {
        fields[key] = new Proxy({}, _proxyHandler);
      }
      return fields[key];
    },
  };

  const _clean = (fields: { [K: string]: DirtyZodSchemaFields }) => {
    const cleaned: string[] = [];
    Object.keys(fields).forEach((k) => {
      const val = fields[k];
      if (Object.keys(val).length) {
        cleaned.concat(_clean(val));
      } else {
        cleaned.push(k);
      }
    });
    return cleaned;
  };

  schema.safeParse(new Proxy(fields, _proxyHandler));
  return _clean(fields);
}

// extract field names and values from zod schema
export function getZodSchemaFieldsV(schema: ZodSchema): ZodSchemaFields {
  type DirtyZodSchemaFields = { [K: string]: DirtyZodSchemaFields };

  const fields = {};

  const _proxyHandler = {
    get(fields: DirtyZodSchemaFields, key: string | symbol) {
      if (key === "then" || typeof key !== "string") {
        return;
      }
      if (!fields[key]) {
        fields[key] = new Proxy({}, _proxyHandler);
      }
      return fields[key];
    },
  };
  const _clean = (fields: DirtyZodSchemaFields) => {
    const cleaned: ZodSchemaFields = {};
    Object.keys(fields).forEach((k) => {
      const val = fields[k];
      cleaned[k] = Object.keys(val).length ? _clean(val) : true;
    });
    return cleaned;
  };
  schema.safeParse(new Proxy(fields, _proxyHandler));
  return _clean(fields);
}
