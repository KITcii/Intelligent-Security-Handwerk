"use server";

import "server-only";
import { BackendCompanyProfession } from "@/types/assistant";
import { handleError } from "../utils";

export async function getProfessions(): Promise<
  BackendCompanyProfession[] | undefined
> {
  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/professions/all`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "force-cache",
      next: { revalidate: 60 * 60 * 24 * 7 }, // 1 week
    });
    const payload: unknown = await res.json();
    switch (res.status) {
      case 200:
        // Successfully retrieved professions
        if (payload !== undefined && payload !== null) {
          const result = payload as BackendCompanyProfession[];
          // sort by name
          return result.sort((a, b) => a.name.localeCompare(b.name));
        } else {
          throw Error(`Profession list could not be fetched`);
        }
      case 400:
      // Bad Request
      case 401:
      // 	Unauthorized access
      case 500:
      // Internal Server Error
      default:
        throw Error(`Profession list could not be fetched`);
    }
  } catch (error) {
    handleError(error);
    return undefined;
  }
}
