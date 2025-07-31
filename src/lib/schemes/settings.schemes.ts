import { CompanySizeClassesValues } from "@/constants";
import { z } from "zod";

export const createUserSchema = z
  .object({
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
    mail: z
      .string()
      .email({ message: "Die E-Mail-Adresse hat ein ungültiges Format." }),
    mailConfirm: z.string(),
  })
  .refine((data) => data.mail === data.mailConfirm, {
    message: "Die E-Mail-Adressen müssen übereinstimmen.",
    path: ["mailConfirm"],
  });

export const updateUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: "Das Eingabefeld darf nicht leer sein." })
    .max(80, {
      message: "Der Vorname darf nicht länger als 80 Zeichen sein.",
    }),
  lastName: z
    .string()
    .trim()
    .min(1, { message: "Das Eingabefeld darf nicht leer sein." })
    .max(80, {
      message: "Der Nachname darf nicht länger als 80 Zeichen sein.",
    }),
});

export const updateUserEmailSchema = z
  .object({
    mail: z
      .string()
      .trim()
      .email({ message: "Die E-Mail-Adresse hat ein ungültiges Format." }),
    mailConfirm: z.string(),
  })
  .refine((data) => data.mail === data.mailConfirm, {
    message: "Die E-Mail-Adressen müssen übereinstimmen.",
    path: ["mailConfirm"],
  });

export const updateUserPasswordSchema = z
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
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Die Passwörterfelder müssen übereinstimmen.",
    path: ["passwordConfirm"],
  });

export const deleteUserAccountSchema = z.object({
  userID: z
    .string()
    .trim()
    .min(1, { message: "Die User ID hat ein ungültiges Format." })
    .max(200, {
      message: "Die User ID hat ein ungültiges Format.",
    }),
});

export const inviteUserSchema = z.object({
  userID: z
    .string()
    .trim()
    .min(1, { message: "Die User ID hat ein ungültiges Format." })
    .max(200, {
      message: "Die User ID hat ein ungültiges Format.",
    }),
});

export const updateCompanySchema = z.object({
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
});

export const updateCompanyAddressSchema = z.object({
  query: z.string().optional(),
  id: z.string(),
  zipCode: z.string().refine(
    (input) => {
      return input === "" || input.match(/^\d{5}$/);
    },
    {
      message: "Die Postleitzahl wurde nicht erkannt.",
    }
  ),
  town: z.string(),
  county: z.string(),
  federalState: z.string(),

  country: z.string(),
});

export const updateCompanyNotificationsSchema = z.object({
  notificationsEmail: z
    .union([
      z.literal(""),
      z
        .string()
        .email({ message: "Die E-Mail-Adresse hat ein ungültiges Format." }),
    ])
    .optional(),
  notificationsEnabled: z
    .enum(["true", "false"])
    .transform((value) => value === "true"),
});

export const deleteCompanySchema = z.object({
  companyID: z.string(),
});
