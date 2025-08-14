"use server";

import { CustomFormState, CustomServerActionState } from "@/types";
import { AssetVariants } from "@/types/assistant";
import "server-only";
import {
  createAliasSchema,
  createTagSchema,
  updateAliasSchema,
} from "../schemes/assets.schemes";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/auth";
import {
  FORM_UPDATE_ERROR_UNKOWN,
  FORM_UPDATE_SUCCESS,
  UNKOWN_SERVER_ERROR_MESSAGE,
} from "@/constants/dialog";
import { revalidatePath } from "next/cache";
import { handleError } from "../utils";

export const addAsset = async (
  assetId: string,
  variant: AssetVariants
): Promise<CustomServerActionState> => {
  try {
    if (assetId === "") {
      return {
        success: false,
        message: `${variant === "infrastructure" ? "Die Komponente" : variant === "measures" ? "Die Maßnahme" : "Das Asset"} konnte nicht hinzugefügt werden.`,
      };
    }
    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error(
        `${variant === "infrastructure" ? "Die Komponente" : variant === "measures" ? "Die Maßnahme" : "Das Asset"} konnte nicht hinzugefügt werden.`
      );
    } else {
      const token: string = session.user.jwt.token;

      const res = await fetch(
        `${process.env.BACKEND_API_URL}/${variant === "infrastructure" ? "component" : variant === "measures" ? "control" : "unknown"}-asset/${encodeURIComponent(assetId)}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const payload: unknown = await res.json();

      switch (res.status) {
        case 200:
          revalidatePath(`/assistant/infrastructure`, "page");
          revalidatePath(`/assistant/measures`, "page");
          revalidatePath("/assistant/recommendations", "page");
          return {
            payload: payload,
            success: true,
            message: `${variant === "infrastructure" ? "Die Komponente" : variant === "measures" ? "Die Maßnahme" : "Das Asset"} wurde hinzugefügt.`,
          };
        case 400:
          // Provided alias was invalid
          return {
            success: false,
            message: `${variant === "infrastructure" ? "Die Komponente" : variant === "measures" ? "Die Maßnahme" : "Das Asset"} konnte nicht gefunden werden.`,
          };
        case 401:
        // Unauthorized
        case 404:
        // Couldn't not get user from session
        case 409:
        // Component was not an asset
        case 500:
        // 	Failed to add alias
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

export const deleteAsset = async ({
  assetId,
  variant,
}: {
  assetId: string;
  variant: AssetVariants;
}): Promise<CustomServerActionState> => {
  try {
    if (assetId === "") {
      return {
        success: false,
        message: `${variant === "infrastructure" ? "Die Komponente" : variant === "measures" ? "Die Maßnahme" : "Das Asset"} konnte nicht entfernt werden.`,
      };
    }
    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error(
        `${variant === "infrastructure" ? "Die Komponente" : variant === "measures" ? "Die Maßnahme" : "Das Asset"} konnte nicht entfernt werden.`
      );
    } else {
      const token: string = session.user.jwt.token;

      const res = await fetch(
        `${process.env.BACKEND_API_URL}/${variant === "infrastructure" ? "component" : variant === "measures" ? "control" : "unknown"}-asset/${encodeURIComponent(assetId)}`,
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
          revalidatePath(`/assistant/infrastructure`, "page");
          revalidatePath(`/assistant/measures`, "page");
          revalidatePath("/assistant/recommendations", "page");
          return {
            success: true,
            message: `${variant === "infrastructure" ? "Die Komponente" : variant === "measures" ? "Die Maßnahme" : "Das Asset"} wurde entfernt.`,
          };
        case 400:
          // Provided alias was invalid
          return {
            success: false,
            message: `${variant === "infrastructure" ? "Die Komponente" : variant === "measures" ? "Die Maßnahme" : "Das Asset"} konnte nicht gefunden werden.`,
          };
        case 401:
        // Unauthorized
        case 404:
        // Couldn't not get user from session
        case 409:
        // Component was not an asset
        case 500:
        // 	Failed to add alias
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

export const createAlias = async (
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
    const parse = createAliasSchema.safeParse(formData);
    if (!parse.success) {
      return {
        success: false,
        errors: parse.error.flatten().fieldErrors,
        message: "Der Alias-Name konnte nicht angelegt werden.",
        fields: fields,
      };
    }

    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error("Der Alias-Name konnte nicht angelegt werden.");
    } else {
      const token: string = session.user.jwt.token;

      const res = await fetch(
        `${process.env.BACKEND_API_URL}/component-asset/${encodeURIComponent(parse.data.componentId)}/alias/${encodeURIComponent(parse.data.alias)}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const payload: unknown = await res.json();

      switch (res.status) {
        case 200:
          revalidatePath("/assistant/infrastructure", "page");
          return {
            payload: payload,
            success: true,
            message: "Der Alias-Name wurde angelegt.",
            fields: fields,
          };
        case 400:
          //Provided alias was empty or already exists
          return {
            success: false,
            errors: { alias: ["Der Alias-Name ist bereits vergeben."] },
            fields: fields,
          };
        case 401:
        // Unauthorized
        case 404:
        // Couldn't not get user from session
        case 409:
        // Component was not an asset
        case 500:
        // 	Failed to add alias
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

export const deleteAlias = async (
  componentId: string,
  alias: string
): Promise<CustomServerActionState> => {
  try {
    if (componentId === "" || alias === "") {
      return {
        success: false,
        message: "Der Alias-Name konnte nicht gelöscht werden.",
      };
    }
    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error("Der Alias-Name konnte nicht gelöscht werden.");
    } else {
      const token: string = session.user.jwt.token;

      const res = await fetch(
        `${process.env.BACKEND_API_URL}/component-asset/${encodeURIComponent(componentId)}/alias/${encodeURIComponent(alias)}`,
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
          revalidatePath("/assistant/infrastructure", "page");
          return {
            success: true,
            message: "Der Alias-Name wurde gelöscht.",
          };
        case 400:
          // Provided alias was invalid
          return {
            success: false,
            message: "Der Alias-Name konnte nicht gefunden werden.",
          };
        case 401:
        // Unauthorized
        case 404:
        // Couldn't not get user from session
        case 409:
        // Component was not an asset
        case 500:
        // 	Failed to add alias
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

export const updateAliasName = async (
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
    const parse = updateAliasSchema.safeParse(formData);
    if (!parse.success) {
      return {
        success: false,
        errors: parse.error.flatten().fieldErrors,
        message: "Der Alias-Name konnte nicht geändert werden.",
        fields: fields,
      };
    }
    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error("Der Alias-Name konnte nicht geändert werden.");
    } else {
      const token: string = session.user.jwt.token;

      console.log("instanceid", parse.data.instanceId);
      const res = await fetch(
        `${process.env.BACKEND_API_URL}/component-asset/alias/${encodeURIComponent(parse.data.instanceId)}/rename/${encodeURIComponent(parse.data.alias)}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);

      const payload: unknown = await res.json();

      switch (res.status) {
        case 200:
          revalidatePath("/assistant/infrastructure", "page");
          return {
            payload: payload,
            success: true,
            message: "Der Alias-Name wurde geändert.",
          };
        case 400:
          // Provided alias was invalid
          return {
            success: false,
            message: "Der Alias-Name ist bereits vergeben.",
          };
        case 401:
        // Unauthorized
        case 404:
        // Couldn't not get user from session
        case 409:
        // Component was not an asset
        case 500:
        // 	Failed to add alias
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

export const createOrAddAliasTag = async (
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
    const parse = createTagSchema.safeParse(formData);
    if (!parse.success) {
      return {
        success: false,
        errors: parse.error.flatten().fieldErrors,
        message: "Der Tag konnte nicht angelegt werden.",
        fields: fields,
      };
    }

    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error("Der Tag konnte nicht angelegt werden.");
    } else {
      const token: string = session.user.jwt.token;
      const res = await fetch(
        `${process.env.BACKEND_API_URL}/component-asset/alias/${encodeURIComponent(parse.data.instanceId)}/tag/${encodeURIComponent(parse.data.tag)}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const payload: unknown = await res.json();
      switch (res.status) {
        case 200:
          revalidatePath("/assistant/infrastructure", "page");
          return {
            success: true,
            message: "Der Tag wurde angelegt.",
            fields: fields,
            payload: payload,
          };
        case 400:
          //Provided alias was empty or already exists
          return {
            success: false,
            errors: { tag: ["Der Tag ist bereits vergeben."] },
            fields: fields,
          };
        case 401:
        // Unauthorized
        case 404:
        // Couldn't not get user from session
        case 409:
        // Component was not an asset
        case 500:
        // 	Failed to add alias
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

export const removeAliasTag = async (
  instanceId: string,
  tag: string
): Promise<CustomServerActionState> => {
  try {
    if (instanceId === "" || tag === "") {
      return {
        success: false,
        message: "Der Tag konnte nicht gelöscht werden.",
      };
    }
    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error("Der Tag konnte nicht gelöscht werden.");
    } else {
      const token: string = session.user.jwt.token;

      const res = await fetch(
        `${process.env.BACKEND_API_URL}/component-asset/alias/${encodeURIComponent(instanceId)}/tag/${encodeURIComponent(tag)}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const payload: unknown = await res.json();
      switch (res.status) {
        case 200:
          revalidatePath("/assistant/infrastructure", "page");
          return {
            payload: payload,
            success: true,
            message: "DerTag wurde gelöscht.",
          };
        case 400:
          // Provided alias was invalid
          return {
            success: false,
            message: "Der Tag konnte nicht gefunden werden.",
          };
        case 401:
        // Unauthorized
        case 404:
        // Couldn't not get user from session
        case 409:
        // Component was not an asset
        case 500:
        // 	Failed to add alias
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

export const updateGuidelineSelection = async (
  controlId: string,
  positions: number[]
): Promise<CustomServerActionState> => {
  try {
    if (controlId === "") {
      return {
        success: false,
        message: FORM_UPDATE_ERROR_UNKOWN,
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

      const posString = positions?.join(",") || "0";
      const res = await fetch(
        `${process.env.BACKEND_API_URL}/control-asset/${encodeURIComponent(controlId)}/guidelines/${encodeURIComponent(posString)}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const payload: unknown = await res.json();

      switch (res.status) {
        case 200:
          revalidatePath("/assistant/measures", "page");
          revalidatePath("/assistant/recommendations", "page");
          return {
            success: true,
            message: FORM_UPDATE_SUCCESS,

            payload: payload,
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
