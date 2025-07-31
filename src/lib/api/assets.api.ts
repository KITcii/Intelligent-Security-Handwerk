"use server";
import "server-only";
import {
  Asset,
  AssetFacet,
  AssetInstance,
  AssetSearchResult,
  AssetVariants,
  ComponentAliasTag,
} from "@/types/assistant";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/auth";
import { handleError } from "../utils";

export async function getAssetTree(
  variant: AssetVariants
): Promise<Asset | undefined> {
  try {
    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error("Infrastructure tree could not be fetched");
    } else {
      const token: string = session.user.jwt.token;
      const res = await fetch(
        `${process.env.BACKEND_API_URL}/${variant === "measures" ? "control" : variant === "infrastructure" ? "component" : "component"}-asset/tree-light`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "force-cache",
          next: { revalidate: 60 * 60 * 1 }, // 1 hour
        }
      );

      const payload: unknown = await res.json();

      switch (res.status) {
        case 200:
          // Successfully retrieved root components
          if (payload !== undefined) {
            const result = payload as [Asset];
            return result[0];
          } else {
            throw Error("Infrastructure tree could not be fetched");
          }
        case 400:
        // Bad Request
        case 401:
        // 	Unauthorized
        case 424:
        // Root-level components couldn't be identified
        case 500:
        // Internal Server Error
        default:
          throw Error("Infrastructure tree could not be fetched");
      }
    }
  } catch (error) {
    handleError(error);
    return undefined;
  }
}

export async function findAssetByParameters(
  variant: AssetVariants,
  request: {
    query?: string;
    selectedOnly: boolean;
    tags?: string[];
    aliases?: string[];
    states?: string[];
  }
): Promise<AssetSearchResult | undefined> {
  try {
    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error("Infrastructure tree could not be fetched");
    } else {
      const token: string = session.user.jwt.token;

      const requestBody = {
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
        searchCriteria: {},
      };

      if (request.query) {
        requestBody.searchCriteria = {
          ...requestBody.searchCriteria,
          all: request.query,
        };
      }

      if (request.selectedOnly) {
        requestBody.searchCriteria = {
          ...requestBody.searchCriteria,
          instantiated: true,
        };
      }

      if (request.tags && request.tags.length > 0) {
        if (request.tags.length === 1 && request.tags[0] === "") {
        } else {
          requestBody.searchCriteria = {
            ...requestBody.searchCriteria,
            tags: request.tags,
          };
        }
      }

      if (request.aliases && request.aliases.length > 0) {
        if (request.aliases.length === 1 && request.aliases[0] === "") {
        } else {
          requestBody.searchCriteria = {
            ...requestBody.searchCriteria,
            aliases: request.aliases,
          };
        }
      }

      if (request.states && request.states.length > 0) {
        if (request.states.length === 1 && request.states[0] === "") {
        } else {
          requestBody.searchCriteria = {
            ...requestBody.searchCriteria,
            statusSet: request.states,
          };
        }
      }
      const res = await fetch(
        `${process.env.BACKEND_API_URL}/${variant === "measures" ? "control" : variant === "infrastructure" ? "component" : "component"}-asset/search`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
          cache: "no-cache",
        }
      );
      const payload: unknown = await res.json();

      switch (res.status) {
        case 200:
          // Successfully retrieved root components
          if (payload !== undefined) {
            return payload as AssetSearchResult;
          } else {
            throw Error("Infrastructure tree could not be fetched");
          }
        case 400:
        // Bad Request
        case 401:
        // 	Unauthorized
        case 424:
        // Root-level components couldn't be identified
        case 500:
        // Internal Server Error
        default:
          throw Error("Infrastructure tree could not be fetched");
      }
    }
  } catch (error) {
    handleError(error);
    return undefined;
  }
}

export async function getAssetById({
  id,
  variant,
}: {
  id: string;
  variant: AssetVariants;
}): Promise<Asset | undefined> {
  try {
    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error(`Asset ${id} could not be fetched`);
    } else {
      const token: string = session.user.jwt.token;
      const res = await fetch(
        `${process.env.BACKEND_API_URL}/${variant === "measures" ? "control" : variant === "infrastructure" ? "component" : "component"}/${encodeURIComponent(id)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "force-cache",
          next: { revalidate: 60 * 60 * 1 }, // 1 hour
        }
      );
      const payload: unknown = await res.json();
      switch (res.status) {
        case 200:
          // Successfully retrieved root components
          if (payload !== undefined) {
            return payload as Asset;
          } else {
            throw Error(`Asset ${id} could not be fetched`);
          }
        case 400:
        // Bad Request
        case 401:
        // 	Unauthorized
        case 404:
        // Asset was not found
        case 500:
        // Internal Server Error
        default:
          throw Error(`Asset ${id} could not be fetched`);
      }
    }
  } catch (error) {
    handleError(error);
    return undefined;
  }
}

export async function getAssetInstanceById({
  id,
  variant,
}: {
  id: string;
  variant: AssetVariants;
}): Promise<AssetInstance | undefined> {
  try {
    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error("Asset instance could not be fetched");
    } else {
      const token: string = session.user.jwt.token;
      const res = await fetch(
        `${process.env.BACKEND_API_URL}/${variant === "measures" ? "control" : variant === "infrastructure" ? "component" : "component"}-asset/${encodeURIComponent(id)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "force-cache",
          next: { revalidate: 60 * 60 * 1 }, // 1 hour
        }
      );
      const payload: unknown = await res.json();
      switch (res.status) {
        case 200:
          // Successfully retrieved root components
          if (payload !== undefined) {
            return payload as AssetInstance;
          } else {
            throw Error("Asset instance could not be fetched");
          }
        case 400:
        // Bad Request
        case 401:
        // 	Unauthorized
        case 424:
        // Root-level components couldn't be identified
        case 500:
        // Internal Server Error
        default:
          throw Error("Asset instance could not be fetched");
      }
    }
  } catch (error) {
    handleError(error);
    return undefined;
  }
}

export async function getFullAssetById({
  id,
  variant,
}: {
  id: string;
  variant: AssetVariants;
}): Promise<Asset | undefined> {
  try {
    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error("Asset instance could not be fetched");
    } else {
      const token: string = session.user.jwt.token;
      const res = await fetch(
        `${process.env.BACKEND_API_URL}/${variant === "measures" ? "control" : variant === "infrastructure" ? "component" : "component"}/${encodeURIComponent(id)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "force-cache",
          next: { revalidate: 60 * 60 * 1 }, // 1 hour
        }
      );
      const payload: unknown = await res.json();
      switch (res.status) {
        case 200:
          // Successfully retrieved root components
          if (payload !== undefined) {
            return payload as Asset;
          } else {
            throw Error("Asset instance could not be fetched");
          }
        case 400:
        // Bad Request
        case 401:
        // 	Unauthorized
        case 424:
        // Root-level components couldn't be identified
        case 500:
        // Internal Server Error
        default:
          throw Error("Asset instance could not be fetched");
      }
    }
  } catch (error) {
    handleError(error);
    return undefined;
  }
}

export async function getAllTags(): Promise<ComponentAliasTag[] | undefined> {
  try {
    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error("Tag list could not be fetched");
    } else {
      const token: string = session.user.jwt.token;
      const res = await fetch(`${process.env.BACKEND_API_URL}/alias/tags`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "force-cache",
        next: { revalidate: 60 * 60 * 1 }, // 1 hour
      });
      const payload: unknown = await res.json();
      switch (res.status) {
        case 200:
          // Successfully retrieved root components
          if (payload !== undefined) {
            const result = payload as ComponentAliasTag[];
            // order result by name
            return result.sort((a, b) => a.name.localeCompare(b.name));
          } else {
            throw Error("Tag list could not be fetched");
          }
        case 400:
        // Bad Request
        case 401:
        // 	Unauthorized
        case 424:
        // Root-level components couldn't be identified
        case 500:
        // Internal Server Error
        default:
          throw Error("Tag list could not be fetched");
      }
    }
  } catch (error) {
    handleError(error);
    return undefined;
  }
}

export async function getAllAliases(): Promise<AssetFacet[] | undefined> {
  try {
    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error("Alias list could not be fetched");
    } else {
      const token: string = session.user.jwt.token;
      const res = await fetch(`${process.env.BACKEND_API_URL}/alias/all`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-cache",
      });
      const payload: unknown = await res.json();
      switch (res.status) {
        case 200:
          // Successfully retrieved root components
          if (payload !== undefined) {
            const result = payload as AssetFacet[];
            // order result by name
            return result.sort((a, b) => a.name.localeCompare(b.name));
          } else {
            throw Error("Alias list could not be fetched");
          }
        case 400:
        // Bad Request
        case 401:
        // 	Unauthorized
        case 500:
        // Internal Server Error
        default:
          throw Error("Alias list could not be fetched");
      }
    }
  } catch (error) {
    handleError(error);
    return undefined;
  }
}

export async function getComponentCount(): Promise<number | undefined> {
  try {
    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error("Component counter could not be fetched");
    } else {
      const token: string = session.user.jwt.token;

      const res = await fetch(
        `${process.env.BACKEND_API_URL}/component-asset/count`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-cache",
        }
      );

      const payload: unknown = await res.json();
      switch (res.status) {
        case 200:
          if (payload !== undefined) {
            return (payload as number) || 0;
          } else {
            throw Error("Component counter could not be fetched");
          }
        case 400:
        // Bad Request
        case 401:
        // 	Unauthorized access
        case 500:
        // Internal Server Error
        default:
          throw Error("Component counter could not be fetched");
      }
    }
  } catch (error) {
    handleError(error);
    return undefined;
  }
}

export async function getMeasureCount(): Promise<number | undefined> {
  try {
    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error("Measure counter could not be fetched");
    } else {
      const token: string = session.user.jwt.token;

      const res = await fetch(
        `${process.env.BACKEND_API_URL}/control-asset/count`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-cache",
        }
      );

      const payload: unknown = await res.json();
      switch (res.status) {
        case 200:
          if (payload !== undefined) {
            return (payload as number) || 0;
          } else {
            throw Error("Measure counter could not be fetched");
          }
        case 400:
        // Bad Request
        case 401:
        // 	Unauthorized access
        case 500:
        // Internal Server Error
        default:
          throw Error("Measure counter could not be fetched");
      }
    }
  } catch (error) {
    handleError(error);
    return undefined;
  }
}
