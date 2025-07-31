"use server";

import "server-only";
import {
  BackendCompanyLocation,
  ZipCodeEntryLight,
  ZipCodeSearchResult,
} from "@/types";
import { escapeRegex, handleError } from "../utils";

// auto completion function
export const findZipCodes = async (
  code: string,
  limit: number
): Promise<ZipCodeEntryLight[] | undefined> => {
  try {
    if (code === "") {
      return undefined;
    }
    const res = await fetch(`${process.env.BACKEND_API_URL}/locations/search`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageable: {
          page: 0,
          size: limit,
          sort: [
            {
              direction: "ASC",
              property: "name",
              ignoreCase: true,
              nullHandling: "NATIVE",
              ascending: true,
            },
          ],
        },
        searchCriteria: {
          all: escapeRegex(code),
        },
      }),
      cache: "no-cache",
    });
    const payload: unknown = await res.json();
    switch (res.status) {
      case 200:
        // Successfully retrieved categories
        if (payload !== undefined && payload !== null) {
          const result = payload as ZipCodeSearchResult;
          return result.content || undefined;
        } else {
          throw Error(`Entries for query ${code} could not be fetched`);
        }
      case 400:
      // Bad Request
      case 401:
      // 	Unauthorized access
      case 500:
      // Internal Server Error
      default:
        throw Error(`Entries for query ${code} could not be fetched`);
    }
  } catch (error) {
    handleError(error);
    return undefined;
  }
};

// get full data for the code
export const getFullZipCode = async (
  id: number
): Promise<BackendCompanyLocation | undefined> => {
  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/locations/${encodeURIComponent(id)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "force-cache",
        next: { revalidate: 60 * 60 * 24 * 7 }, // 1 week
      }
    );
    const payload: unknown = await res.json();
    switch (res.status) {
      case 200:
        // Successfully retrieved categories
        if (payload !== undefined && payload !== null) {
          return payload as BackendCompanyLocation;
        } else {
          throw Error(`Entries for id ${id} could not be fetched`);
        }
      case 400:
      // Bad Request
      case 401:
      // 	Unauthorized access
      case 500:
      // Internal Server Error
      default:
        throw Error(`Entries for id ${id} could not be fetched`);
    }
  } catch (error) {
    handleError(error);
    return undefined;
  }
};
