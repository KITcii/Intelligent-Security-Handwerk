import ActivationLinkError from "@/components/root/auth/ActivationLinkError";
import PasswordResetForm from "@/components/root/auth/PasswordResetForm";
import { RESET_PASSWORD_TOKEN_ERROR_MESSAGE } from "@/constants/dialog";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ token: string | undefined }>;
}) => {
  const params = await searchParams;
  if (params.token == undefined || params.token === "") {
    return <ActivationLinkError message={RESET_PASSWORD_TOKEN_ERROR_MESSAGE} />;
  } else {
    return <PasswordResetForm token={params.token} />;
  }
};

export default Page;
