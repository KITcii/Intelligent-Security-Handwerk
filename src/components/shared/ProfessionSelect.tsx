import { useEffect, useMemo, useState } from "react";
import Combobox from "./Combobox";
import { BackendCompanyProfession } from "@/types/assistant";
import { getProfessions } from "@/lib/api/meta.api";

const ProfessionSelect = ({
  fieldName,
  fieldValue,
}: {
  fieldName: string;
  fieldValue: string | null | undefined;
}) => {
  const [professions, setProfessions] = useState<
    BackendCompanyProfession[] | undefined
  >(undefined);

  const fetchProfessions = useMemo(
    () => async () => {
      try {
        const response = await getProfessions();
        setProfessions(response);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {}
    },
    []
  );

  useEffect(() => {
    fetchProfessions().catch(() => {});
  }, [fetchProfessions]);

  return (
    <Combobox
      placeholder="Gewerbe"
      name={fieldName}
      value={fieldValue}
      alignment="start"
      contextWidth="max-[450px]:max-w-[300px]"
      allowEmpty={true}
      data={
        professions !== undefined
          ? professions.map((p) => {
              return {
                value: p.id,
                label: p.name,
              };
            })
          : []
      }
    />
  );
};

export default ProfessionSelect;
