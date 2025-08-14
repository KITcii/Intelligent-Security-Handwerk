import GeneralErrorMessage from "@/components/shared/GeneralErrorMessage";
import { getCompanyData } from "@/lib/api/company.api";
import SectionCompanyNotificationsForm from "./SectionCompanyNotificationsForm";

const SectionCompanyNotifications = async () => {
  const company = await getCompanyData();
  if (company === undefined) {
    return <GeneralErrorMessage />;
  }

  return <SectionCompanyNotificationsForm stateData={company} />;
};

export default SectionCompanyNotifications;
