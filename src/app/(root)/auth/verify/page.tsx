import ActivationLinkError from "@/components/root/auth/ActivationLinkError";
import { Button } from "@/components/ui/button";
import { ACTIVATION_TOKEN_ERROR_MESSAGE } from "@/constants/dialog";
import { verifyEmailRequest } from "@/lib/actions/auth.action";
import Link from "next/link";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ token: string | undefined }>;
}) => {
  let success = false;
  const params = await searchParams;

  if (params.token == undefined || params.token === "") {
    success = false;
  } else {
    await verifyEmailRequest(params.token)
      .then((res) => {
        success = res;
      })
      .catch(() => {
        success = false;
      });
  }

  return (
    <div className="default-page-wrapper max-w-[50ch]">
      {success ? (
        <div className="default-page-wrapper max-w-[50ch]">
          <h1 className="h1-heading">Benutzerkonto erfolgreich aktiviert!</h1>
          <div className="mt-4">
            <p>
              Ihr Benutzerkonto wurde erfolgreich aktiviert. Sie können sich ab
              sofort mit Ihrer E-Mail Adresse und Passwort{" "}
              <Link href="/auth/login" className="inline-link">
                anmelden
              </Link>
              .
            </p>
            <Button className="button-success mt-6 w-full" asChild>
              <Link href="/auth/login">
                <i className="material-symbols-outlined filled inline-block align-middle me-1">
                  person
                </i>
                <span className="inline-block align-middle ">
                  Zur Benutzeranmeldung
                </span>
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <ActivationLinkError message={ACTIVATION_TOKEN_ERROR_MESSAGE} />
      )}
    </div>
  );
};

export default Page;
