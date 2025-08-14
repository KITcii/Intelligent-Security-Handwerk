import SettingsTabs from "@/components/assistant/settings/SettingsTabs";
import Header from "@/components/assistant/shared/Header";

const page = () => {
  return (
    <div>
      <Header title="Einstellungen" />
      <SettingsTabs />
    </div>
  );
};

export default page;
