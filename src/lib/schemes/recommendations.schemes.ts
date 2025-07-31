import { RecommendationStatusValues, STAR_ENUM } from "@/constants/assistant";
import { z } from "zod";

export const updateRecommendationStatusSchema = z.object({
  status: z.enum(RecommendationStatusValues, {
    errorMap: () => ({ message: "Es wurde kein Status ausgewählt." }),
  }),
  recommendations: z
    .object(
      { id: z.string(), status: z.enum(RecommendationStatusValues) },
      { message: "Es muss mindestens eine Empfehlung ausgewählt werden." }
    )
    .array()
    .min(1, {
      message: "Es muss mindestens eine Empfehlung ausgewählt werden.",
    })
    .max(9999, {
      message:
        "Es können nicht mehr als 9999 Empfehlungen gleichzeitig aktualisiert werden.",
    }),
});

export const recommendationFeedbackSchema = z.object({
  comprehensibility: z.enum(STAR_ENUM, {
    errorMap: () => {
      return { message: "Die Wertung muss zwischen 1 und 5 Sternen liegen." };
    },
  }),
  feasibility: z.enum(STAR_ENUM, {
    errorMap: () => {
      return { message: "Die Wertung muss zwischen 1 und 5 Sternen liegen." };
    },
  }),
  informative: z.enum(STAR_ENUM, {
    errorMap: () => {
      return { message: "Die Wertung muss zwischen 1 und 5 Sternen liegen." };
    },
  }),
  comment: z
    .string()
    .max(10000, { message: "Der Text darf maximal 10.000 Zeichen lang sein." })
    .optional(),
  recommendatioId: z.string({
    message: "Es wurde keine Empfehlung angegeben.",
  }),
});
