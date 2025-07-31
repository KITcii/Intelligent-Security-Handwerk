import ActivationLinkError from "@/components/root/auth/ActivationLinkError";
import UserInitialPasswordForm from "@/components/root/auth/UserInitialPasswordForm";
import { ACTIVATION_TOKEN_ERROR_MESSAGE } from "@/constants/dialog";
import React from "react";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ token: string | undefined }>;
}) => {
  const params = await searchParams;
  if (params.token == undefined || params.token === "") {
    return <ActivationLinkError message={ACTIVATION_TOKEN_ERROR_MESSAGE} />;
  } else {
    return <UserInitialPasswordForm token={params.token} />;
  }
};

export default Page;
