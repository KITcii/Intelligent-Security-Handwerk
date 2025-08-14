"use client";

import Link from "next/link";

import PasswordForm from "./PasswordForm";

const UserInitialPasswordForm = ({ token }: { token: string }) => {
  return (
    <div className="default-page-wrapper flex flex-col gap-6 items-center">
      <div className="w-full text-start">
        <Link href="/auth/login" className="inline-link">
          <i className="material-symbols-outlined md-s inline-block align-middle me-1">
            arrow_back
          </i>
          <span className="inline-block align-middle inline-link">
            Zurück zur Anmeldung
          </span>
        </Link>
      </div>
      <PasswordForm
        token={token}
        heading="Initiales Passwort festlegen"
        successHeading="Passwort erfolgreich gespeichert"
      />
    </div>
  );
};

export default UserInitialPasswordForm;
