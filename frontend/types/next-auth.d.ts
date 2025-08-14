import "next-auth";
import { BackendUser } from "./assistant";

declare module "next-auth" {
  interface User {
    jwt: { expiryDate: string; issuedAt: string; token: string };
    user: BackendUser;
    exp: number;
    iat: number;
    jti: string;
  }

  interface Session extends DefaultSession {
    user: User;
    expires: string;
    error: string;
  }
}
