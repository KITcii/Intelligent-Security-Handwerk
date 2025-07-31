import BackgroundPanel from "@/components/assistant/shared/BackgroundPanel";
import SectionUserDelete from "./SectionUserDelete";
import SectionUserEmail from "./SectionUserEmail";
import SectionUserGeneral from "./SectionUserGeneral";
import SectionUserPassword from "./SectionUserPassword";
import SettingsSectionWrapper from "@/components/assistant/settings/shared/SettingsSectionWrapper";
import SettingsSection from "../shared/SettingsSection";

const ContentUserSettings = () => {
  return (
    <BackgroundPanel>
      <SettingsSectionWrapper>
        <SettingsSection
          title="Allgemeine Einstellungen"
          description="Grundlegende Einstellungen für das Benutzerkonto. Die Benutzerrolle kann nicht geändert werden."
        >
          <SectionUserGeneral />
        </SettingsSection>
        <SettingsSection
          title="E-Mail-Adresse ändern"
          description="Aktualisierung der E-Mail-Adresse welche zur Kommunikation mit dem IT-Sicherheitsassistenten genutzt wird. Die E-Mail-Adresse dient gleichzeitig als Benutzername."
        >
          <SectionUserEmail />
        </SettingsSection>
        <SettingsSection
          title="Zugangspasswort ändern"
          description="Aktualisierung des Passwortes zur Anmeldung in das Benutzerkonto."
        >
          <SectionUserPassword />
        </SettingsSection>
        <SettingsSection
          title="Benutzerkonto löschen"
          description="Löschung des gesamten Benutzerkontos und aller damit verbundenen Daten. Diese Aktion kann nicht rückgängig gemacht werden."
        >
          <SectionUserDelete />
        </SettingsSection>
      </SettingsSectionWrapper>
    </BackgroundPanel>
  );
};

export default ContentUserSettings;
