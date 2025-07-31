import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Das Eingabefeld darf nicht leer sein." })
    .max(120, {
      message: "Der Name darf nicht länger als 120 Zeichen sein.",
    })
    .trim(),
  mail: z
    .string()
    .email({ message: "Die E-Mail-Adresse hat ein ungültiges Format." }),
  acceptPrivacy: z.enum(["true"]).transform((value) => value === "true"),
  message: z
    .string()
    .min(1, { message: "Bitte geben Sie eine Nachricht ein." })
    .max(20000, {
      message: "Die Nachricht darf maximal 20.000 Zeichen lang sein.",
    }),
});
