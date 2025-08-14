"use server";
import { CustomFormState } from "@/types";
import { contactFormSchema } from "../schemes/general.schemes";
import { delayLoad } from "./test.action";
import {
  FORM_SUBMIT_ERROR_MESSAGE,
  FORM_SUBMIT_SUCCESS_MESSAGE,
  FORM_UPDATE_ERROR_UNKOWN,
} from "@/constants/dialog";
import "server-only";
import { handleError } from "../utils";

export const sendContactForm = async (
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
    const parse = contactFormSchema.safeParse(formData);
    if (!parse.success) {
      return {
        errors: parse.error.flatten().fieldErrors,
        success: false,
        fields: fields,
        message: FORM_SUBMIT_ERROR_MESSAGE,
      };
    }

    // // nextIteration: persist data with API call
    await delayLoad(0);
    const validatedData = parse.data;
    console.log("Form data: ", validatedData);

    return {
      success: true,
      fields: fields,
      message: FORM_SUBMIT_SUCCESS_MESSAGE,
    };
  } catch (error) {
    handleError(error);
    return {
      success: false,
      message: FORM_UPDATE_ERROR_UNKOWN,
    };
  }
};
