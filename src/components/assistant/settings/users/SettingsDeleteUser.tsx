import { Button } from "@/components/ui/button";
import DeleteAccountForm from "../shared/DeleteAccountForm";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";

const SettingsDeleteUser = ({ userID }: { userID: string }) => {
  return (
    <DeleteAccountForm userID={userID} redirect={false}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <div className="flex justify-end">
                <Button variant="outline" size="icon">
                  <i className="material-symbols-outlined text-tc-muted hover:text-highlight-50">
                    delete
                  </i>
                </Button>
              </div>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent className="text-base">
            Benutzer löschen
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </DeleteAccountForm>
  );
};

export default SettingsDeleteUser;
