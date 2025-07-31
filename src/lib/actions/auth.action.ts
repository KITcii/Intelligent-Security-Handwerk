"use server";
import { CreateOwnerRequest, CustomFormState } from "@/types";
import "server-only";
import {
  registerSchema,
  reminderSchema,
  setPasswordSchema,
} from "../schemes/authentication.schemes";
import {
  REGISTER_FORM_GENERAL_ERROR_MESSAGE,
  REGISTER_FORM_SUCCESS_MESSAGE,
  REGISTER_FORM_USER_EXISTS_ERROR_MESSAGE,
  REQUEST_SUBMIT_ERROR_MESSAGE,
  REQUEST_SUBMIT_SUCCESS_MESSAGE,
  RESET_PASSWORD_GENERAL_ERROR_MESSAGE,
  RESET_PASSWORD_SUCCESS_MESSAGE,
  RESET_PASSWORD_TOKEN_ERROR_MESSAGE,
  UNKNOWN_USER_NAME_MESSAGE,
  UNKOWN_SERVER_ERROR_MESSAGE,
} from "@/constants/dialog";
import { handleError, transformNestedFormToObject } from "../utils";

export const verifyEmailRequest = async (token: string) => {
  try {
    if (token.length === 0) {
      return false;
    }
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/auth/verify?token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
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
      // User was not found
      case 500:
      // Internal Server Error
      default:
        throw Error(REQUEST_SUBMIT_ERROR_MESSAGE);
    }
  } catch (error) {
    handleError(error);
    return false;
  }
};

export const submitPasswordResetRequest = async (
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
    const parse = reminderSchema.safeParse(formData);
    if (!parse.success) {
      return {
        errors: parse.error.flatten().fieldErrors,
        message: UNKNOWN_USER_NAME_MESSAGE,
        success: false,
        fields: fields,
      };
    }

    const res = await fetch(
      `${process.env.BACKEND_API_URL}/auth/password-forgot?mail=${encodeURIComponent(parse.data.mail)}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    switch (res.status) {
      case 200:
        return {
          success: true,
          message: REQUEST_SUBMIT_SUCCESS_MESSAGE,
          fields: fields,
        };
      case 401:
      // 	Unauthorized access
      case 404:
        // User was not found
        return {
          success: false,
          message: UNKNOWN_USER_NAME_MESSAGE,
        };
      case 400:
      // Bad Request
      case 500:
      // Internal Server Error
      default:
        return {
          success: false,
          message: UNKOWN_SERVER_ERROR_MESSAGE,
        };
    }
  } catch (error) {
    handleError(error);
    return {
      success: false,
      message: UNKOWN_SERVER_ERROR_MESSAGE,
    };
  }
};

export const resetPassword = async (
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
    const parse = setPasswordSchema.safeParse(formData);
    if (!parse.success) {
      return {
        errors: parse.error.flatten().fieldErrors,
        message: RESET_PASSWORD_GENERAL_ERROR_MESSAGE,
        success: false,
        fields: fields,
      };
    }

    const res = await fetch(
      `${process.env.BACKEND_API_URL}/auth/password-choose`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: parse.data.token,
          newPassword: parse.data.password,
        }),
      }
    );
    switch (res.status) {
      case 200:
        return {
          success: true,
          message: RESET_PASSWORD_SUCCESS_MESSAGE,
          fields: fields,
        };
      case 401:
      // 	Unauthorized access
      case 404:
        // User was not found
        return {
          success: false,
          message: RESET_PASSWORD_TOKEN_ERROR_MESSAGE,
          fields: fields,
          errors: { token: ["invalid token"] },
        };
        break;
        break;
      case 400:
      // Bad Request
      case 500:
      // Internal Server Error
      default:
        return {
          success: false,
          message: UNKOWN_SERVER_ERROR_MESSAGE,
        };
    }
  } catch (error) {
    handleError(error);
    return {
      success: false,
      message: UNKOWN_SERVER_ERROR_MESSAGE,
    };
  }
};

export const registerAccount = async (
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
    const parse = registerSchema.safeParse(formData);

    if (!parse.success) {
      return {
        success: false,
        message: REGISTER_FORM_GENERAL_ERROR_MESSAGE,
        errors: parse.error.errors.reduce(
          (acc: Record<string, string[]>, item) => {
            const path = item.path.join(".");
            if (!acc[path]) {
              acc[path] = [];
            }
            acc[path].push(item.message);
            return acc;
          },
          {}
        ),
        fields: fields,
      };
    }

    const requestBody: CreateOwnerRequest = {
      user: {
        mail: parse.data.mails?.mail || "",
        firstName: parse.data.firstName,
        lastName: parse.data.lastName,
      },
      password: parse.data.passwords?.password || "",
      company: {
        name: parse.data.name,
        profession: parse.data.professionId
          ? { id: parse.data.professionId }
          : null,
        companyType: parse.data.companyType || null,
        locationId: parse.data.locationId || null,
      },
    };

    const res = await fetch(`${process.env.BACKEND_API_URL}/users/register`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    switch (res.status) {
      case 201:
        return {
          success: true,
          message: REGISTER_FORM_SUCCESS_MESSAGE,
          fields: fields,
        };
      case 409:
        // User already exists
        return {
          success: false,
          errors: {
            "mails.mail": [REGISTER_FORM_USER_EXISTS_ERROR_MESSAGE],
          },
          message: REGISTER_FORM_USER_EXISTS_ERROR_MESSAGE,
          fields: fields,
        };
      case 400:
      //	Bad Request
      case 401:
      // 	Unauthorized access
      case 404:
      // 	Location was not found
      case 424:
      // Role 'OWNER' could not be assigned
      case 500:
      // Internal Server Error
      default:
        return {
          success: false,
          fields: fields,
          message: REGISTER_FORM_GENERAL_ERROR_MESSAGE,
        };
    }
  } catch (error) {
    handleError(error);
    return {
      success: false,
      message: REGISTER_FORM_GENERAL_ERROR_MESSAGE,
    };
  }
};
