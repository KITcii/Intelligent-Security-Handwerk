import SectionCompanyGerneralForm from "./SectionCompanyGerneralForm";
import { getCompanyData } from "@/lib/api/company.api";
import GeneralErrorMessage from "@/components/shared/GeneralErrorMessage";
import { getProfessions } from "@/lib/api/meta.api";

const SectionCompanyGeneral = async () => {
  const [company, professions] = await Promise.allSettled([
    getCompanyData(),
    getProfessions(),
  ]);
  if (
    company.status === "rejected" ||
    (company.status === "fulfilled" && company.value === undefined)
  ) {
    return <GeneralErrorMessage />;
  } else {
    return (
      <SectionCompanyGerneralForm
        stateData={company.value}
        metaProps={{
          professions:
            professions.status === "fulfilled" ? professions.value : undefined,
        }}
      />
    );
  }
};

export default SectionCompanyGeneral;
