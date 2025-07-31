import AssetContent from "@/components/assistant/assets/AssetContent";
import Header from "@/components/assistant/shared/Header";

const page = () => {
  return (
    <>
      <Header title="ITSM-Maßnahmen" />
      <h1 className="text-xl font-bold mb-6">Ihre ITSM-Maßnahmen verwalten</h1>
      <AssetContent variant="measures" />
    </>
  );
};

export default page;
