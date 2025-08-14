import "server-only";
import { BackendUser } from "@/types/assistant";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/auth";
import { handleError } from "../utils";

export async function getUserData(): Promise<BackendUser | undefined> {
  try {
    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error("User data could not be fetched");
    } else {
      const userId: string = session.user.id;
      const token: string = session.user.jwt.token;

      const res = await fetch(
        `${process.env.BACKEND_API_URL}/users/${encodeURIComponent(userId)}`,
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
          if (payload !== undefined) {
            return payload as BackendUser;
          } else {
            throw Error("User data could not be fetched");
          }
        case 400:
        // Bad Request
        case 401:
        // 	Unauthorized access
        case 404:
        // User was not found
        case 500:
        // Internal Server Error
        default:
          throw Error("User data could not be fetched");
      }
    }
  } catch (error) {
    handleError(error);
    return undefined;
  }
}

export async function getAllUsers(): Promise<BackendUser[] | undefined> {
  try {
    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error("Users list could not be fetched");
    } else {
      const token: string = session.user.jwt.token;

      const res = await fetch(
        `${process.env.BACKEND_API_URL}/companies/users`,
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
          if (payload !== undefined) {
            return payload as BackendUser[];
          } else {
            throw Error("Users list could not be fetched");
          }
        case 400:
        // Bad Request
        case 401:
        // 	Unauthorized access
        case 404:
        // User was not found
        case 500:
        // Internal Server Error
        default:
          throw Error("Users list could not be fetched");
      }
    }
  } catch (error) {
    handleError(error);
    return undefined;
  }
}
