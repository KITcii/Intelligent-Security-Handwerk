import { CompanySizeClassesValues } from "@/constants";
import { z } from "zod";

export const signUpSchema = z.object({});

export const signInSchema = z.object({
  username: z
    .string({
      required_error:
        "Bitte geben Sie einen gültigen Benutzernamen / E-Mail-Adresse an.",
    })
    .email({ message: "Die E-Mail-Adresse hat ein ungültiges Format." })
    .min(1, { message: "Feld darf nicht leer sein." }),
  password: z
    .string({
      required_error: "Bitte geben Sie Ihr zugehöriges Passwort an.",
    })
    .min(1, { message: "Feld darf nicht leer sein." }),
});

export const reminderSchema = z.object({
  mail: z
    .string()
    .email({ message: "Die E-Mail-Adresse hat ein ungültiges Format." }),
});

export const setPasswordSchema = z
  .object({
    password: z
      .string()
      .trim()
      .min(1, { message: "Das Passwortfeld darf nicht leer sein." })
      .max(200, {
        message: "Das Passwort darf nicht länger als 200 Zeichen sein.",
      }),
    passwordConfirm: z.string().trim(),
    token: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Die Passwörterfelder müssen übereinstimmen.",
    path: ["passwordConfirm"],
  });

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "Das Eingabefeld darf nicht leer sein." })
    .max(80, {
      message: "Der Vorname darf nicht länger als 80 Zeichen sein.",
    })
    .trim(),
  lastName: z
    .string()
    .min(1, { message: "Das Eingabefeld darf nicht leer sein." })
    .max(80, {
      message: "Der Nachname darf nicht länger als 80 Zeichen sein.",
    })
    .trim(),
  mails: z
    .object({
      mail: z
        .string()
        .min(1, { message: "Das Eingabefeld 'E-Mail' darf nicht leer sein." })
        .email({ message: "Die E-Mail-Adresse hat ein ungültiges Format." }),
      mailConfirm: z
        .string()
        .min(1, { message: "Das Eingabefeld darf nicht leer sein." }),
    })
    .refine((data) => data.mail === data.mailConfirm, {
      message: "Die E-Mail-Adressen müssen übereinstimmen.",
      path: ["mailConfirm"],
    })
    .optional(),

  passwords: z
    .object({
      password: z
        .string()
        .trim()
        .min(1, { message: "Das Passwortfeld darf nicht leer sein." })
        .max(200, {
          message: "Das Passwort darf nicht länger als 200 Zeichen sein.",
        }),
      passwordConfirm: z.string().trim(),
    })
    .refine((data) => data.password == data.passwordConfirm, {
      message: "Die Passwörterfelder müssen übereinstimmen.",
      path: ["passwordConfirm"],
    })
    .optional(),
  name: z
    .string()
    .min(1, { message: "Das Eingabefeld darf nicht leer sein." })
    .max(300, {
      message: "Der Betriebsname darf nicht länger als 300 Zeichen sein.",
    })
    .trim(),
  professionId: z.string().optional(),
  companyType: z
    .union([
      z.literal("").transform(() => undefined),
      z.enum(CompanySizeClassesValues, {
        message: "Die Betriebsgröße ist ungültig.",
      }),
    ])
    .nullable()
    .optional(),
  locationId: z.string().optional(),
  query: z.string().optional(),
  zipCode: z.string().refine(
    (input) => {
      return input === "" || input.match(/^\d{5}$/);
    },
    {
      message: "Die Postleitzahl wurde nicht erkannt.",
    }
  ),
  town: z.string().optional(),
  county: z.string().optional(),
  federalState: z.string().optional(),
  country: z.string().optional(),
  acceptTerms: z
    .enum(["true"], { message: "Bitte stimmen Sie der Datenverarbeitung zu." })
    .transform((value) => value === "true"),
});
