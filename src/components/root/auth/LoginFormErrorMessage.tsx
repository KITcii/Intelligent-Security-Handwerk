"use client";

import { useFormStatus } from "react-dom";

const LoginFormErrorMessage = ({
  message,
  fault,
}: {
  message?: string;
  fault: boolean;
}) => {
  const { pending } = useFormStatus();
  if (fault) {
    return (
      <div>
        {!pending && (
          <div className="text-danger-high space-y-2">
            <h2 className="font-semibold">{message}</h2>
          </div>
        )}
      </div>
    );
  } else {
    return <></>;
  }
};

export default LoginFormErrorMessage;
