"use server";

import "server-only";
import {
  GlossaryCategory,
  GlossaryEntry,
  GlossaryEntryLight,
  GlossarySearchResult,
} from "@/types/assistant";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/auth";
import { escapeRegex, handleError } from "../utils";

export async function getRandomGlossarEntry(
  categoryId: number
): Promise<GlossaryEntry | undefined> {
  try {
    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error("Random glossary entry could not be fetched");
    } else {
      const token: string = session.user.jwt.token;

      const res = await fetch(
        `${process.env.BACKEND_API_URL}/glossary/random?categoryId=${encodeURIComponent(categoryId)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-cache",
        }
      );

      const payload: unknown = await res.json();

      switch (res.status) {
        case 200:
          // Successfully retrieved entry
          if (payload !== undefined) {
            return payload as GlossaryEntry;
          } else {
            throw Error("Random glossary entry could not be fetched");
          }
        case 400:
        // Bad Request
        case 401:
        // 	Unauthorized access
        case 500:
        // Internal Server Error
        default:
          throw Error("Random glossary entry could not be fetched");
      }
    }
  } catch (error) {
    handleError(error);
    return undefined;
  }
}

export const getAllCategories = async (): Promise<
  GlossaryCategory[] | undefined
> => {
  try {
    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error("Glossary categoryies could not be fetched");
    } else {
      const token: string = session.user.jwt.token;

      const res = await fetch(
        `${process.env.BACKEND_API_URL}/glossary/categories`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "force-cache",
          next: { revalidate: 60 * 60 * 24 }, // 1 day
        }
      );

      const payload: unknown = await res.json();

      switch (res.status) {
        case 200:
          // Successfully retrieved categories
          if (payload !== undefined) {
            return payload as GlossaryCategory[];
          } else {
            throw Error("Glossary categoryies could not be fetched");
          }
        case 400:
        // Bad Request
        case 401:
        // 	Unauthorized access
        case 500:
        // Internal Server Error
        default:
          throw Error("Glossary categoryies could not be fetched");
      }
    }
  } catch (error) {
    handleError(error);
    return undefined;
  }
};

export const getCategoryAndEntriesById = async (
  id: string
): Promise<GlossaryCategory | undefined> => {
  try {
    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error("Glossary categoryies could not be fetched");
    } else {
      const token: string = session.user.jwt.token;
      const res = await fetch(
        `${process.env.BACKEND_API_URL}/glossary/categories`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "force-cache",
          next: { revalidate: 60 * 60 * 12 }, // 12 hours
        }
      );
      const payload: unknown = await res.json();
      switch (res.status) {
        case 200:
          // Successfully retrieved categories
          if (payload !== undefined) {
            const categories = payload as GlossaryCategory[];
            const category = categories.find((c) => c.id == id);
            if (category === undefined) {
              throw Error("Category not found");
            } else {
              const entries = await getEntriesByCategoryName(category.name);
              if (entries === undefined) {
                throw Error("Entries could not be fetched");
              } else {
                // Successfully retrieved entries
                category.entries = entries;
                return category;
              }
            }
          } else {
            throw Error("Glossary categoryies could not be fetched");
          }
        case 400:
        // Bad Request
        case 401:
        // 	Unauthorized access
        case 500:
        // Internal Server Error
        default:
          throw Error("Glossary categoryies could not be fetched");
      }
    }
  } catch (error) {
    handleError(error);
    return undefined;
  }
};

export const getEntriesByCategoryName = async (
  name: string,
  limit?: number
): Promise<GlossaryEntryLight[] | undefined> => {
  try {
    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error(`Entries for category ${name} could not be fetched`);
    } else {
      const token: string = session.user.jwt.token;

      const res = await fetch(
        `${process.env.BACKEND_API_URL}/glossary/search-by-category`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            category: name
              .replace(/[{}\[\]:,"]+/g, "") // Remove JSON formatting characters
              .replace(/\\/g, "") // Remove escape characters
              .trim(),
            pageable: {
              page: 0,
              size: limit || 9999,
              sort: [
                {
                  direction: "ASC",
                  property: "category",
                  ignoreCase: true,
                  nullHandling: "NATIVE",
                  ascending: true,
                },
              ],
            },
          }),
          cache: "force-cache",
          next: { revalidate: 60 * 60 * 12 }, // 12 hours
        }
      );

      const payload: unknown = await res.json();

      switch (res.status) {
        case 200:
          // Successfully retrieved categories
          if (payload !== undefined && payload !== null) {
            const results = payload as GlossarySearchResult;
            if (results.content !== undefined && results.content !== null) {
              return results.content;
            } else {
              return [];
            }
          } else {
            throw Error(`Entries for category ${name} could not be fetched`);
          }
        case 400:
        // Bad Request
        case 401:
        // 	Unauthorized access
        case 500:
        // Internal Server Error
        default:
          throw Error(`Entries for category ${name} could not be fetched`);
      }
    }
  } catch (error) {
    handleError(error);
    return undefined;
  }
};

export const searchEntries = async ({
  query,
  page,
  limit,
}: {
  query: string;
  page?: number;
  limit?: number;
}): Promise<GlossarySearchResult | undefined> => {
  try {
    if (query === "") {
      return undefined;
    }
    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error(`Entries for query ${query} could not be fetched`);
    } else {
      const token: string = session.user.jwt.token;

      const res = await fetch(
        `${process.env.BACKEND_API_URL}/glossary/search`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            pageable: {
              page: (page || 1) > 0 ? (page || 1) - 1 : 0,
              size: limit,
              sort: [
                {
                  direction: "ASC",
                  property: "keyword",
                  ignoreCase: true,
                  nullHandling: "NATIVE",
                  ascending: true,
                },
              ],
            },
            searchCriteria: {
              all: escapeRegex(query),
            },
          }),
          cache: "no-cache",
        }
      );
      const payload: unknown = await res.json();
      switch (res.status) {
        case 200:
          // Successfully retrieved categories
          if (payload !== undefined && payload !== null) {
            return payload as GlossarySearchResult;
          } else {
            throw Error(`Entries for query ${query} could not be fetched`);
          }
        case 400:
        // Bad Request
        case 401:
        // 	Unauthorized access
        case 500:
        // Internal Server Error
        default:
          throw Error(`Entries for query ${query} could not be fetched`);
      }
    }
  } catch (error) {
    handleError(error);
    return undefined;
  }
};

export const getFullEntry = async (
  id: string
): Promise<GlossaryEntry | undefined> => {
  try {
    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error("Glossary entry could not be fetched");
    } else {
      const token: string = session.user.jwt.token;
      const res = await fetch(
        `${process.env.BACKEND_API_URL}/glossary/${encodeURIComponent(id)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "force-cache",
          next: { revalidate: 60 * 60 * 12 }, // 12 hours
        }
      );
      const payload: unknown = await res.json();
      switch (res.status) {
        case 200:
          // Successfully retrieved categories
          if (payload !== undefined) {
            return payload as GlossaryEntry;
          } else {
            throw Error("Glossary entry could not be fetched");
          }
        case 400:
        // Bad Request
        case 401:
        // 	Unauthorized access
        case 404:
        // Entry was not found
        case 500:
        // Internal Server Error
        default:
          throw Error("Glossary entry could not be fetched");
      }
    }
  } catch (error) {
    handleError(error);
    return undefined;
  }
};
