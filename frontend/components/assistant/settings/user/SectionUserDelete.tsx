import { Button } from "@/components/ui/button";
import DeleteAccountForm from "../shared/DeleteAccountForm";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Link from "next/link";
import { getUserData } from "@/lib/api/user.api";
import GeneralErrorMessage from "@/components/shared/GeneralErrorMessage";

const SectionUserDelete = async () => {
  const user = await getUserData();

  if (user === undefined) {
    return <GeneralErrorMessage />;
  }
  return (
    <div className="flex flex-col h-full justify-center">
      {user.roles.includes("OWNER") ? (
        <div className="sm:text-right w-full sm:justify-items-end">
          <p className="max-w-[50ch] mb-3">
            Sie sind als Eigentümer angemeldet.
            <br /> Die Löschung Ihres Benutzerkontos ist daher nur mit der
            Löschung des gesamten Betriebes möglich.
          </p>

          <Link
            href={"?tab=company"}
            target="_top"
            className="inline-link font-semibold"
          >
            <i className="material-symbols-outlined md-s inline-block align-middle me-1">
              arrow_forward
            </i>{" "}
            Siehe Betriebseinstellungen
          </Link>
        </div>
      ) : (
        <DeleteAccountForm userID={user.id} redirect={true}>
          <AlertDialogTrigger asChild>
            <div>
              <div className="flex justify-end">
                <Button className="button-danger w-fit text-base">
                  <i className="material-symbols-outlined me-2">delete</i>
                  Benutzerkonto löschen
                </Button>
              </div>
            </div>
          </AlertDialogTrigger>
        </DeleteAccountForm>
      )}
    </div>
  );
};

export default SectionUserDelete;
