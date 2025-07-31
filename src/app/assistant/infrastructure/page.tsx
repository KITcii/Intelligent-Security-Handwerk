import AssetContent from "@/components/assistant/assets/AssetContent";
import Header from "@/components/assistant/shared/Header";
const Page = () => {
  return (
    <>
      <Header title="IT-Infrastruktur" />
      <h1 className="text-xl font-bold mb-6">
        Ihre IT-Infrastruktur verwalten
      </h1>
      <AssetContent variant="infrastructure" />
    </>
  );
};

export default Page;
