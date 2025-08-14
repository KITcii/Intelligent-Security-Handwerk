"use client";

import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

// currently unused
// Usage example: <SessionProvider refetchInterval={5 * 60}>{children}</SessionProvider>
function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider refetchInterval={5 * 60}>{children}</SessionProvider>;
}

export default AuthProvider;
