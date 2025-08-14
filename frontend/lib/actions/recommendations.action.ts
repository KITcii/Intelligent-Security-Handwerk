"use server";

import "server-only";
import { CustomFormState, CustomServerActionState } from "@/types";
import {
  recommendationFeedbackSchema,
  updateRecommendationStatusSchema,
} from "../schemes/recommendations.schemes";
import { delayLoad } from "./test.action";
import {
  FORM_UPDATE_ERROR,
  FORM_UPDATE_ERROR_UNKOWN,
} from "@/constants/dialog";
import { handleError, transformNestedFormToObject } from "../utils";
import { revalidatePath } from "next/cache";
import {
  RecommendationPerception,
  RecommendationStatus,
} from "@/types/assistant";
import { getServerSession } from "next-auth";
import { authOptions } from "../configs/auth";

export const toggelRecommendationRelevancy = async (
  id: string
): Promise<CustomServerActionState> => {
  try {
    if (id === "") {
      return {
        success: false,
        message: "Der Status konnte nicht aktualisiert werden.",
      };
    }
    const session = await getServerSession(authOptions);
    if (session === null) {
      return {
        success: false,
        message: "Der Status konnte nicht aktualisiert werden.",
      };
    } else {
      const token: string = session.user.jwt.token;

      const res = await fetch(
        `${process.env.BACKEND_API_URL}/recommendations/relevance/${encodeURIComponent(id)}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      switch (res.status) {
        case 200:
          revalidatePath("/assistant/recommendations", "page");
          revalidatePath("/assistant/measures", "page");
          return {
            success: true,
            message: "Der Status wurde erfolgreich aktualisiert.",
          };
        case 400:
        // Bad Request
        case 401:
        // 	Unauthorized access
        case 404:
        // Couldn't find token associated with session
        case 500:
        // Internal Server Error
        default:
          return {
            success: false,
            message: "Der Status konnte nicht aktualisiert werden.",
          };
      }
    }
  } catch (error) {
    handleError(error);
    return {
      success: false,
      message: "Der Status konnte nicht aktualisiert werden.",
    };
  }
};

export const updateRecommendationsStatus = async (
  prevState: CustomFormState,
  data: FormData
): Promise<CustomFormState> => {
  try {
    const formData = transformNestedFormToObject(Object.fromEntries(data));

    const fields: Record<string, string> = {};
    for (const key of Object.keys(formData)) {
      if (typeof formData[key] === "string") {
        fields[key] = formData[key];
      }
    }

    const parse = updateRecommendationStatusSchema.safeParse(formData);

    if (!parse.success) {
      return {
        success: false,
        message: parse.error.errors[0].message,
        fields: fields,
      };
    }

    const session = await getServerSession(authOptions);
    if (session === null) {
      return {
        success: false,
        message: "Der Status konnte nicht aktualisiert werden.",
      };
    } else {
      const token: string = session.user.jwt.token;

      // nextIteration: replace with a single API call
      const fetchPromises = parse.data.recommendations.map(
        async (recommendation: {
          id: string;
          status: RecommendationStatus;
        }) => {
          try {
            // toggle only if visibility is different
            if (
              (parse.data.status === "irrelevant" &&
                recommendation.status === "irrelevant") ||
              (parse.data.status !== "irrelevant" &&
                recommendation.status !== "irrelevant")
            ) {
              return true;
            }
            const res = await fetch(
              `${process.env.BACKEND_API_URL}/recommendations/relevance/${encodeURIComponent(recommendation.id)}`,
              {
                method: "PUT",
                headers: {
                  Accept: "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            switch (res.status) {
              case 200:
                return true;
              case 400:
              // Bad Request
              case 401:
              // 	Unauthorized access
              case 404:
              // Couldn't find token associated with session
              case 500:
              // Internal Server Error
              default:
                return false;
            }
          } catch (error) {
            handleError(error);
            return false;
          }
        }
      );

      await Promise.all(fetchPromises);

      revalidatePath("/assistant/recommendations", "page");

      return {
        success: true,
        message: "Der Status wurde erfolgreich aktualisiert.",
      };
    }
  } catch (error) {
    handleError(error);
    return {
      success: false,
      message: FORM_UPDATE_ERROR,
    };
  }
};

export const sendRecommendationPerception = async (
  id: string,
  perception: RecommendationPerception
): Promise<CustomServerActionState> => {
  try {
    // nextIteration: persist data with API call
    await delayLoad(0);
    console.log(`Action Data: ${perception} ${id}`);
    return {
      success: true,
      message: "Wir haben Ihre Rückmeldung erhalten.",
    };
  } catch (error) {
    handleError(error);
    return {
      success: false,
    };
  }
};

export const sendRecommendationFeedback = async (
  prevState: CustomFormState,
  data: FormData
): Promise<CustomFormState> => {
  try {
    const formData = Object.fromEntries(data);
    const fields: Record<string, string> = {};
    for (const key of Object.keys(formData)) {
      if (typeof formData[key] === "string") {
        fields[key] = formData[key];
      }
    }
    const parse = recommendationFeedbackSchema.safeParse(formData);
    if (!parse.success) {
      return {
        errors: parse.error.flatten().fieldErrors,
        success: false,
        fields: fields,
      };
    }

    // nextIteration: persist data with API call
    await delayLoad(0);
    const validatedData = parse.data;
    console.log("Form data: ", validatedData);

    return {
      success: true,
      fields: fields,
    };
  } catch (error) {
    handleError(error);
    return {
      success: false,
      message: FORM_UPDATE_ERROR_UNKOWN,
    };
  }
};
