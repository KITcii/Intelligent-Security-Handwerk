import { z } from "zod";

export const createAliasSchema = z.object({
  alias: z
    .string()
    .min(1, { message: "Das Eingabefeld darf nicht leer sein." })
    .max(25, {
      message: "Ein Alias-Name darf nicht länger als 25 Zeichen sein.",
    })
    .trim(),
  componentId: z
    .string()
    .trim()
    .min(1, { message: "Die Komponenten-ID darf nicht leer sein." }),
});

export const updateAliasSchema = z.object({
  alias: z
    .string()
    .min(1, { message: "Das Eingabefeld darf nicht leer sein." })
    .max(25, {
      message: "Ein Alias-Name darf nicht länger als 25 Zeichen sein.",
    })
    .trim(),
  instanceId: z
    .string()
    .trim()
    .min(1, { message: "Die Instanz-ID darf nicht leer sein." }),
});

export const createTagSchema = z.object({
  tag: z
    .string()
    .min(1, { message: "Das Eingabefeld darf nicht leer sein." })
    .max(25, {
      message: "Ein Tag-Name darf nicht länger als 25 Zeichen sein.",
    })
    .trim(),
  instanceId: z
    .string()
    .trim()
    .min(1, { message: "Die Instanz-ID darf nicht leer sein." }),
});
