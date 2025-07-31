import React from "react";
import NoUserAccount from "./NoUserAccount";

const ActivationLinkError = ({ message }: { message: string }) => {
  return (
    <div className="default-page-wrapper max-w-[50ch]">
      <h1 className="h1-heading">Fehler!</h1>
      <div className="mt-4">
        <p>{message}</p>
      </div>
      <NoUserAccount className="mt-8" />
    </div>
  );
};

export default ActivationLinkError;
