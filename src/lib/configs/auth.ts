import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { handleError } from "../utils";

export const authOptions = {
  // Configure authentication provider
  providers: [
    CredentialsProvider({
      name: "Anmeldung mit...",
      credentials: {
        username: {
          label: "E-Mail Adresse",
          type: "text",
        },
        password: { label: "Passwort", type: "password" },
      },
      async authorize(credentials) {
        const data = {
          mail: credentials?.username,
          password: credentials?.password,
        };
        try {
          const res = await fetch(`${process.env.BACKEND_API_URL}/auth/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });
          const payload: unknown = await res.json();
          switch (res.status) {
            case 200:
              if (payload !== undefined) {
                return payload as User;
              } else {
                return null;
              }
            case 400:
            // Bad Request
            case 401:
            // Unauthorized
            case 403:
            // Not verified
            case 409:
            // User does not exist
            case 500:
              // Internal Server Error
              return null;
            default:
              return null;
          }
        } catch (error) {
          handleError(error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/require-await
    async jwt({ token, trigger, user }) {
      if (trigger === "signIn") {
        return { ...token, user: user.user, jwt: user.jwt };
      } else {
        return { ...token };
      }
    },
    // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
    async session({ session, token, user }) {
      const userData = token as unknown as User;
      session.user.id = userData.user.id;
      session.user.jwt = userData.jwt;
      return session;
    },
  },
  events: {
    signOut: async function ({ token }) {
      try {
        const logoutToken = token as unknown as User;
        const res = await fetch(`${process.env.BACKEND_API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${logoutToken.jwt.token}`,
          },
        });
        if (!res.ok) {
          return undefined;
        }
      } catch (error) {
        handleError(error);
        return undefined;
      }
    },
  },
} satisfies NextAuthOptions;
