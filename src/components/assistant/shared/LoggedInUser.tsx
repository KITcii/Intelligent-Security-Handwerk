import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { UserRoleLabels } from "@/constants/user";
import ProgressBar from "@/components/shared/ProgressBar";
import { getUserData } from "@/lib/api/user.api";
import SignOut from "./SignOut";
import { getCompanyData } from "@/lib/api/company.api";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const LoggedInUser = async () => {
  const [user, company] = await Promise.all([getUserData(), getCompanyData()]);

  if (user !== undefined) {
    return (
      <div className="flex flex-row gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="cursor-default">
              <Avatar>
                <AvatarFallback className="bg-highlight-50 text-white text-2xl font-bold">
                  {user.lastName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent className="text-base">
              {user.roles.includes("OWNER")
                ? UserRoleLabels.OWNER
                : user.roles.includes("USER")
                  ? UserRoleLabels.USER
                  : "Unbekannt"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex flex-col">
          <p className="font-bold">
            {user.firstName} {` `}
            {user.lastName}
          </p>
          <p className="max-w-40 line-clamp-1 text-sm overflow-hidden text-ellipsis">
            {company?.name}
          </p>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <span className="material-symbols-outlined md-l ">
                expand_more
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent collisionPadding={40} className="p-2 ">
              <DropdownMenuLabel className="text-base flex flex-row gap-2 pe-8">
                <div>
                  <i className="material-symbols-outlined md-xl filled">
                    person
                  </i>
                </div>
                <div>
                  <div>Benutzerkonto</div>
                  <div className="text-sm font-normal">
                    {user.roles.includes("OWNER")
                      ? UserRoleLabels.OWNER
                      : user.roles.includes("USER")
                        ? UserRoleLabels.USER
                        : "Unbekannt"}
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="flex flex-row gap-3 text-base hover:bg-highlight-50 hover:text-tc-contrast px-4">
                  <i className="material-symbols-outlined md-m">tune</i>
                  <Link href="/assistant/settings" className="link-inline">
                    Einstellungen
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="flex flex-row gap-3 text-base h hover:bg-highlight-50 hover:text-tc-contrast px-4">
                  <i className="material-symbols-outlined md-m">logout</i>
                  <SignOut />
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }
  return (
    <div className="min-w-20">
      <ProgressBar progress={50} spinner={true} style="bold" className="w-8" />
    </div>
  );
};

export default LoggedInUser;
