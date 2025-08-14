"use server";

import {
  createUserSchema,
  deleteUserAccountSchema,
  inviteUserSchema,
  updateUserEmailSchema,
  updateUserPasswordSchema,
  updateUserSchema,
} from "@/lib/schemes/settings.schemes";
import { CustomFormState } from "@/types";
import {
  DELETE_USER_GENERAL_ERROR_MESSAGE,
  DELETE_USER_SUCCESS_MESSAGE,
  DELETE_USER_UNKNOWN_USER_MESSAGE,
  FORM_UPDATE_ERROR,
  FORM_UPDATE_ERROR_UNKOWN,
  INVITE_USER_GENERAL_ERROR_MESSAGE,
  INVITE_USER_SUCCESS_MESSAGE,
  REGISTER_EMAIL_INUSE_ERROR_MESSAGE,
  REINVITE_USER_SUCCESS_MESSAGE,
  SET_PASSWORD_INUSE_ERROR_MESSAGE,
  UNKOWN_SERVER_ERROR_MESSAGE,
} from "@/constants/dialog";
import "server-only";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/auth";
import { revalidatePath } from "next/cache";
import { handleError } from "../utils";

export const updateUser = async (
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
    const parse = updateUserSchema.safeParse(formData);

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
      const userId: string = session.user.id;
      const res = await fetch(
        `${process.env.BACKEND_API_URL}/users/${encodeURIComponent(userId)}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: parse.data.firstName,
            lastName: parse.data.lastName,
          }),
        }
      );
      switch (res.status) {
        case 200:
          revalidatePath("/assistant/settings", "page");
          return {
            success: true,
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

export const updateEmail = async (
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
    const parse = updateUserEmailSchema.safeParse(formData);
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
      const userId: string = session.user.id;
      const res = await fetch(
        `${process.env.BACKEND_API_URL}/users/${encodeURIComponent(userId)}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ mail: parse.data.mail }),
        }
      );
      switch (res.status) {
        case 200:
          revalidatePath("/assistant/settings", "page");
          return {
            success: true,
            fields: fields,
          };
        case 409:
          //	User with given mail already exists
          return {
            success: false,
            message: FORM_UPDATE_ERROR,
            errors: {
              mail: [SET_PASSWORD_INUSE_ERROR_MESSAGE],
            },
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

export const updatePassword = async (
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
    const parse = updateUserPasswordSchema.safeParse(formData);
    if (!parse.success) {
      return {
        errors: parse.error.flatten().fieldErrors,
        success: false,
        fields: fields,
      };
    }

    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error("User data could not be updated");
    } else {
      const token: string = session.user.jwt.token;

      const res = await fetch(
        `${process.env.BACKEND_API_URL}/users/password-change`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/text",
            Authorization: `Bearer ${token}`,
          },
          body: parse.data.password,
        }
      );
      switch (res.status) {
        case 200:
          return {
            success: true,
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
          throw Error("User data could not be updated");
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

export const createUser = async (
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
    const parse = createUserSchema.safeParse(formData);
    if (!parse.success) {
      return {
        errors: parse.error.flatten().fieldErrors,
        success: false,
        fields: fields,
      };
    }

    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error("User could not be created");
    } else {
      const token: string = session.user.jwt.token;

      const res = await fetch(`${process.env.BACKEND_API_URL}/users/invite`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mail: parse.data.mail,
          firstName: parse.data.firstName,
          lastName: parse.data.lastName,
        }),
      });
      switch (res.status) {
        case 200:
          revalidatePath("/assistant/settings", "page");
          return {
            success: true,
            message: INVITE_USER_SUCCESS_MESSAGE,
            fields: fields,
          };
        case 409:
          // User already exists
          return {
            success: false,
            message: INVITE_USER_GENERAL_ERROR_MESSAGE,
            errors: { mail: [REGISTER_EMAIL_INUSE_ERROR_MESSAGE] },
            fields: fields,
          };
        case 400:
        // Bad Request
        case 401:
        // 	Unauthorized access
        case 424:
        // Associated role not found
        case 500:
        // Internal Server Error
        default:
          return {
            success: false,
            message: UNKOWN_SERVER_ERROR_MESSAGE,
          };
      }
    }
  } catch (error) {
    handleError(error);
    return {
      success: false,
      message: UNKOWN_SERVER_ERROR_MESSAGE,
    };
  }
};

export const sendUserInvitation = async (
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
    const parse = inviteUserSchema.safeParse(formData);
    if (!parse.success) {
      return {
        success: false,
        message: "Die Benutzerkonto-ID hat ein ungültiges Format.",
        fields: fields,
      };
    }

    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error("User could not be created");
    } else {
      const token: string = session.user.jwt.token;

      const res = await fetch(`${process.env.BACKEND_API_URL}/users/reinvite`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: parse.data.userID,
      });
      switch (res.status) {
        case 200:
          revalidatePath("/assistant/settings", "page");
          return {
            success: true,
            message: REINVITE_USER_SUCCESS_MESSAGE,
            fields: fields,
          };
        case 400:
        // Bad Request
        case 401:
        // 	Unauthorized access
        case 500:
        // Internal Server Error
        default:
          return {
            success: false,
            message: UNKOWN_SERVER_ERROR_MESSAGE,
          };
      }
    }
  } catch (error) {
    handleError(error);
    return {
      success: false,
      message: UNKOWN_SERVER_ERROR_MESSAGE,
    };
  }
};

export const deleteAccount = async (
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
    const parse = deleteUserAccountSchema.safeParse(formData);
    if (!parse.success) {
      return {
        success: false,
        message: DELETE_USER_GENERAL_ERROR_MESSAGE,
        fields: fields,
      };
    }

    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error("Das Benutzerkonto konnte nicht gelöscht werden.");
    } else {
      const token: string = session.user.jwt.token;
      const userId = parse.data.userID;

      const res = await fetch(
        `${process.env.BACKEND_API_URL}/users/${encodeURIComponent(userId)}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      switch (res.status) {
        case 200:
          revalidatePath("/assistant/settings", "page");
          return {
            success: true,
            message: DELETE_USER_SUCCESS_MESSAGE,
            fields: fields,
          };
        case 404:
          // User was not found
          return {
            success: false,
            message: DELETE_USER_UNKNOWN_USER_MESSAGE,
          };
        case 400:
        // Bad Request
        case 401:
        // 	Unauthorized access
        case 500:
        // Internal Server Error
        default:
          return {
            success: false,
            message: UNKOWN_SERVER_ERROR_MESSAGE,
          };
      }
    }
  } catch (error) {
    handleError(error);
    return {
      success: false,
      message: UNKOWN_SERVER_ERROR_MESSAGE,
    };
  }
};
