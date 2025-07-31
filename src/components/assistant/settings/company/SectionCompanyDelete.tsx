import { getCompanyData } from "@/lib/api/company.api";
import SectionCompanyDeleteForm from "./SectionCompanyDeleteForm";
import GeneralErrorMessage from "@/components/shared/GeneralErrorMessage";

const SectionCompanyDelete = async () => {
  const company = await getCompanyData();

  if (company === undefined) {
    return <GeneralErrorMessage />;
  }

  return (
    <div className="flex flex-col h-full justify-center">
      <SectionCompanyDeleteForm stateData={company} />
    </div>
  );
};

export default SectionCompanyDelete;
