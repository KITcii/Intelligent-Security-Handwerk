import { getCompanyData } from "@/lib/api/company.api";
import SectionCompanyAddressForm from "./SectionCompanyAddressForm";
import GeneralErrorMessage from "@/components/shared/GeneralErrorMessage";

const SectionCompanyAddress = async () => {
  const company = await getCompanyData();
  if (company === undefined) {
    return <GeneralErrorMessage />;
  }
  return <SectionCompanyAddressForm stateData={company} />;
};

export default SectionCompanyAddress;
