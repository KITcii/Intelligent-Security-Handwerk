"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import LoadingXL from "../../shared/LoadingXL";

const FormDialogPendingWrapper = ({
  children,
  text,
}: {
  text: string;
  children: React.ReactNode;
}) => {
  const { pending } = useFormStatus();
  return <div>{pending ? <LoadingXL text={text} /> : children}</div>;
};

export default FormDialogPendingWrapper;
