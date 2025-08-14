import SectionUserGeneralForm from "./SectionUserGeneralForm";
import { getUserData } from "@/lib/api/user.api";
import GeneralErrorMessage from "@/components/shared/GeneralErrorMessage";

const SectionUserGeneral = async () => {
  const user = await getUserData();

  if (user === undefined) {
    return <GeneralErrorMessage />;
  }

  return <SectionUserGeneralForm stateData={user} />;
};

export default SectionUserGeneral;
