import LoadingXL from "../shared/LoadingXL";

const SuspenseOverviewTable = () => {
  return (
    <div className="w-full h-full flex items-center justify-center min-h-64">
      <LoadingXL text="Handlungsempfelungen werden geladen" />
    </div>
  );
};

export default SuspenseOverviewTable;
