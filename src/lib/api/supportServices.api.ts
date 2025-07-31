"use server";
import "server-only";
import {
  SupportServiceEntry,
  SupportServicesSearchResult,
} from "@/types/assistant";
import { handleError } from "../utils";
import { getServerSession } from "next-auth";
import { authOptions } from "../configs/auth";

export const getAllEntries = async (): Promise<
  SupportServiceEntry[] | undefined
> => {
  try {
    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error(`Support service entries could not be fetched`);
    } else {
      const token: string = session.user.jwt.token;

      const res = await fetch(
        `${process.env.BACKEND_API_URL}/support/search-full`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "force-cache",
          next: { revalidate: 60 * 60 * 1 }, // 1 hour
          body: JSON.stringify({
            pageable: {
              page: 0,
              size: 9999,
              sort: [
                {
                  direction: "ASC",
                  property: "id",
                  ignoreCase: true,
                  nullHandling: "NATIVE",
                  ascending: true,
                },
              ],
            },
            searchCriteria: {
              offerDescriptionLike: " ",
            },
          }),
        }
      );

      const payload: unknown = await res.json();

      switch (res.status) {
        case 200:
          // Successfully retrieved categories
          if (payload !== undefined && payload !== null) {
            const results = payload as SupportServicesSearchResult;
            if (results.content !== undefined && results.content !== null) {
              return results.content;
            } else {
              return [];
            }
          } else {
            throw Error(`Support service entries could not be fetched`);
          }
        case 400:
        // Bad Request
        case 401:
        // 	Unauthorized access
        case 500:
        // Internal Server Error
        default:
          throw Error(`Support service entries could not be fetched`);
      }
    }
  } catch (error) {
    handleError(error);
    return undefined;
  }
};
