"use server";

import "server-only";
import {
  BackendRecommendation,
  RecommendationsListEntry,
  RecommendationsMetaData,
  StandardCoverageData,
  StandardCoverageDimensions,
  StandardScore,
} from "@/types/assistant";

import { handleError } from "../utils";
import { getServerSession } from "next-auth";
import { authOptions } from "../configs/auth";

export async function getRecommendationsMetaData(): Promise<
  RecommendationsMetaData | undefined
> {
  try {
    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error("Recommenddations meta data could not be fetched");
    } else {
      const token: string = session.user.jwt.token;

      const res = await fetch(
        `${process.env.BACKEND_API_URL}/recommendations/count`,
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
            return {
              newCounter: (payload as number) || 0,
            };
          } else {
            throw Error("Recommenddations meta data could not be fetched");
          }
        case 400:
        // Bad Request
        case 401:
        // 	Unauthorized access
        case 500:
        // Internal Server Error
        default:
          throw Error("Recommenddations meta data could not be fetched");
      }
    }
  } catch (error) {
    handleError(error);
    return undefined;
  }
}

export const getStandardCoverageDimensions = async (): Promise<
  StandardCoverageDimensions | undefined
> => {
  try {
    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error("Standard coverage dimensions could not be fetched");
    } else {
      const token: string = session.user.jwt.token;

      const res = await fetch(
        `${process.env.BACKEND_API_URL}/assessment/chart-dimensions`,
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
          if (payload !== undefined) {
            const result = payload as [StandardCoverageDimensions];
            if (result.length > 0) {
              return result[0];
            }
          } else {
            throw Error("Standard coverage dimensions could not be fetched");
          }
        case 400:
        // Bad Request
        case 401:
        // 	Unauthorized access
        case 404:
        // User was not found
        case 424:
        // Security-standard data for coverage not found
        case 500:
        // Internal Server Error
        default:
          throw Error("Standard coverage dimensions could not be fetched");
      }
    }
  } catch (error) {
    handleError(error);
    return undefined;
  }
};

export const getStandardScore = async (): Promise<
  StandardScore | undefined
> => {
  try {
    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error("Standard coverage data could not be fetched");
    } else {
      const token: string = session.user.jwt.token;

      const res = await fetch(
        `${process.env.BACKEND_API_URL}/assessment/score`,
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
            return payload as StandardScore;
          } else {
            throw Error("Standard coverage data could not be fetched");
          }
        case 400:
        // Bad Request
        case 401:
        // 	Unauthorized access
        case 404:
        // User was not found
        case 424:
        // Security-standard data for coverage not found
        case 500:
        // Internal Server Error
        default:
          throw Error("Standard coverage data could not be fetched");
      }
    }
  } catch (error) {
    handleError(error);
    return undefined;
  }
};

export const getStandardCoverage = async (): Promise<
  StandardCoverageData | undefined
> => {
  try {
    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error("Standard coverage data could not be fetched");
    } else {
      const token: string = session.user.jwt.token;

      const res = await fetch(
        `${process.env.BACKEND_API_URL}/assessment/chart-data`,
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
            return payload as StandardCoverageData;
          } else {
            throw Error("Standard coverage data could not be fetched");
          }
        case 400:
        // Bad Request
        case 401:
        // 	Unauthorized access
        case 404:
        // User was not found
        case 424:
        // Security-standard data for coverage not found
        case 500:
        // Internal Server Error
        default:
          throw Error("Standard coverage data could not be fetched");
      }
    }
  } catch (error) {
    handleError(error);
    return undefined;
  }
};

export async function getAllRecommendations(): Promise<
  RecommendationsListEntry[] | undefined
> {
  try {
    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error("Recommendation list could not be fetched");
    } else {
      const token: string = session.user.jwt.token;

      const res = await fetch(
        `${process.env.BACKEND_API_URL}/recommendations/all-unpaged`,
        {
          method: "POST",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
          cache: "force-cache",
          next: { revalidate: 60 * 60 * 1 }, // 1 hour
        }
      );
      const payload: unknown = await res.json();

      switch (res.status) {
        case 200:
          if (payload !== undefined) {
            return payload as RecommendationsListEntry[];
          } else {
            throw Error("Recommendation list could not be fetched");
          }
        case 400:
        // Bad Request
        case 401:
        // 	Unauthorized access
        case 404:
        // User was not found
        case 424:
        // Security-standard data for coverage not found
        case 500:
        // Internal Server Error
        default:
          throw Error("Recommendation list could not be fetched");
      }
    }
  } catch (error) {
    handleError(error);
    return undefined;
  }
}

export async function getRecommendationById(
  id: string
): Promise<BackendRecommendation | undefined> {
  try {
    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error(`Recommendation with id ${id} could not be fetched`);
    } else {
      const token: string = session.user.jwt.token;

      const res = await fetch(
        `${process.env.BACKEND_API_URL}/recommendations/${encodeURIComponent(id)}`,
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
            return payload as BackendRecommendation;
          } else {
            throw Error(`Recommendation with id ${id} could not be fetched`);
          }
        case 400:
        // Bad Request
        case 401:
        // 	Unauthorized access
        case 500:
        // Internal Server Error
        default:
          throw Error(`Recommendation with id ${id} could not be fetched`);
      }
    }
  } catch (error) {
    handleError(error);
    return undefined;
  }
}
