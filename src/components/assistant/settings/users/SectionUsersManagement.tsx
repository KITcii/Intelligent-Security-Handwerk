import SectionUsersManagementTable from "./SectionUsersManagementTable";
import { getAllUsers } from "@/lib/api/user.api";
import GeneralErrorMessage from "@/components/shared/GeneralErrorMessage";

const SectionUsersManagement = async () => {
  const users = await getAllUsers();

  if (users === undefined) {
    return <GeneralErrorMessage />;
  }

  return <SectionUsersManagementTable data={users} />;
};

export default SectionUsersManagement;
