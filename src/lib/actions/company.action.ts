"use server";

import {
  FORM_UPDATE_ERROR_UNKOWN,
  FORM_UPDATE_SUCCESS,
} from "@/constants/dialog";
import { CustomFormState, UpdateCompanyRequest } from "@/types";
import { delayLoad } from "./test.action";
import {
  deleteCompanySchema,
  updateCompanyAddressSchema,
  updateCompanyNotificationsSchema,
  updateCompanySchema,
} from "../schemes/settings.schemes";
import "server-only";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/auth";
import { revalidatePath } from "next/cache";
import { handleError } from "../utils";

export const updateCompany = async (
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
    const parse = updateCompanySchema.safeParse(formData);
    if (!parse.success) {
      return {
        errors: parse.error.flatten().fieldErrors,
        success: false,
        fields: fields,
      };
    }

    const session = await getServerSession(authOptions);
    if (session === null) {
      return {
        success: false,
        message: FORM_UPDATE_ERROR_UNKOWN,
      };
    } else {
      const token: string = session.user.jwt.token;
      const requestBody: UpdateCompanyRequest = {
        name: parse.data.name,
        companyType: parse.data.companyType || null,
        profession: parse.data.professionId
          ? {
              id: parse.data.professionId,
            }
          : null,
      };

      const res = await fetch(`${process.env.BACKEND_API_URL}/companies`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
      switch (res.status) {
        case 200:
          revalidatePath("/assistant/settings", "page");
          return {
            success: true,
            message: FORM_UPDATE_SUCCESS,
            fields: fields,
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
            message: FORM_UPDATE_ERROR_UNKOWN,
          };
      }
    }
  } catch (error) {
    handleError(error);
    return {
      success: false,
      message: FORM_UPDATE_ERROR_UNKOWN,
    };
  }
};

export const updateAddress = async (
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
    const parse = updateCompanyAddressSchema.safeParse(formData);
    if (!parse.success) {
      return {
        errors: parse.error.flatten().fieldErrors,
        success: false,
        fields: fields,
      };
    }
    const session = await getServerSession(authOptions);
    if (session === null) {
      return {
        success: false,
        message: FORM_UPDATE_ERROR_UNKOWN,
      };
    } else {
      const token: string = session.user.jwt.token;

      const requestBody: UpdateCompanyRequest = {
        locationId: parse.data.id || null,
      };
      // nextIteration: test partial data update
      const res = await fetch(`${process.env.BACKEND_API_URL}/companies`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
      switch (res.status) {
        case 200:
          revalidatePath("/assistant/settings", "page");
          return {
            success: true,
            message: FORM_UPDATE_SUCCESS,
            fields: fields,
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
            message: FORM_UPDATE_ERROR_UNKOWN,
          };
      }
    }
  } catch (error) {
    handleError(error);
    return {
      success: false,
      message: FORM_UPDATE_ERROR_UNKOWN,
    };
  }
};

export const updateNotificationsSettings = async (
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
    const parse = updateCompanyNotificationsSchema.safeParse(formData);
    if (!parse.success) {
      return {
        errors: parse.error.flatten().fieldErrors,
        success: false,
        fields: fields,
      };
    }

    // nextIteration: re-implement check in zod schema for client side functionality
    if (
      parse.data.notificationsEnabled &&
      parse.data.notificationsEmail !== undefined &&
      parse.data.notificationsEmail === ""
    ) {
      return {
        errors: {
          notificationsEmail: [
            "Wenn Benachrichtigungen aktiviert sind, muss eine E-Mail Adresse angegeben werden.",
          ],
        },
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

export const deleteCompany = async (
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

    const parse = deleteCompanySchema.safeParse(formData);
    if (!parse.success) {
      return {
        success: false,
        message: "Der Betrieb konnte nicht gelöscht werden.",
        fields: fields,
      };
    }

    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error("Der Betrieb konnte nicht gelöscht werden.");
    } else {
      const token: string = session.user.jwt.token;
      const userId = session.user.id;
      const res = await fetch(
        `${process.env.BACKEND_API_URL}/users/${encodeURIComponent(userId)}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/text",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      switch (res.status) {
        case 200:
          return {
            success: true,
            message: "Betrieb erfolgreich gelöscht.",
            fields: fields,
          };
        case 400:
        // Bad Request
        case 401:
        // 	Unauthorized access
        case 404:
        // User was not found
        case 500:
        // Internal Server Error
        default:
          throw Error("Der Betrieb konnte nicht gelöscht werden.");
      }
    }
  } catch (error) {
    handleError(error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : FORM_UPDATE_ERROR_UNKOWN,
    };
  }
};
