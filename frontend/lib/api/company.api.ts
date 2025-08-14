"use server";

import { BackendCompany } from "@/types/assistant";
import "server-only";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/auth";
import { handleError } from "../utils";

export async function getCompanyData(): Promise<BackendCompany | undefined> {
  try {
    const session = await getServerSession(authOptions);
    if (session === null) {
      throw Error("Company data could not be fetched");
    } else {
      const token: string = session.user.jwt.token;

      const res = await fetch(`${process.env.BACKEND_API_URL}/companies/my`, {
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
          if (payload !== undefined) {
            const rval = payload as BackendCompany;
            delete rval.owner;
            delete rval.users;
            return rval;
          } else {
            throw Error("Company data could not be fetched");
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
          throw Error("Company data could not be fetched");
      }
    }
  } catch (error) {
    handleError(error);
    return undefined;
  }
}
