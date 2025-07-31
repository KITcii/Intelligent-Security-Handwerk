import GeneralErrorMessage from "@/components/shared/GeneralErrorMessage";
import { getUserData } from "@/lib/api/user.api";
import SectionUserEmailForm from "./SectionUserEmailForm";

const SectionUserEmail = async () => {
  const user = await getUserData();

  if (user === undefined) {
    return <GeneralErrorMessage />;
  }

  return <SectionUserEmailForm stateData={user} />;
};

export default SectionUserEmail;
