import BackgroundPanel from "@/components/assistant/shared/BackgroundPanel";
import SettingsSectionWrapper from "@/components/assistant/settings/shared/SettingsSectionWrapper";
import SectionUsersManagement from "./SectionUsersManagement";

const ContentUsersSettings = () => {
  return (
    <BackgroundPanel>
      <SettingsSectionWrapper>
        <SectionUsersManagement />
      </SettingsSectionWrapper>
    </BackgroundPanel>
  );
};

export default ContentUsersSettings;
