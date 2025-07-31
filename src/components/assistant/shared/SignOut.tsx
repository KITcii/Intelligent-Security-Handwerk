"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

const SignOut = () => {
  return (
    <Link
      href="#"
      onClick={() => {
        void signOut();
      }}
    >
      Abmelden
    </Link>
  );
};

export default SignOut;
