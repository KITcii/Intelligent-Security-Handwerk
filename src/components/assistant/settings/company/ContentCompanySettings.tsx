import BackgroundPanel from "@/components/assistant/shared/BackgroundPanel";
import SectionCompanyAddress from "./SectionCompanyAddress";
import SectionCompanyDelete from "./SectionCompanyDelete";
import SectionCompanyGeneral from "./SectionCompanyGeneral";
import SectionCompanyNotifications from "./SectionCompanyNotifications";
import SettingsSectionWrapper from "@/components/assistant/settings/shared/SettingsSectionWrapper";
import SettingsSection from "../shared/SettingsSection";

const ContentCompanySettings = () => {
  return (
    <BackgroundPanel>
      <SettingsSectionWrapper>
        <SettingsSection
          title="Allgemeine Einstellungen"
          description="Grundlegende Einstellungen Ihres Handwerksbetriebes. Die Angaben zur Branche und der Betriebsgröße sind optional."
        >
          <SectionCompanyGeneral />
        </SettingsSection>
        <SettingsSection
          title="Betriebsstandort"
          description="Angaben zum groben Standort Ihres Betriebes. Diese Angaben sind optional."
        >
          <SectionCompanyAddress />
        </SettingsSection>
        <SettingsSection
          title="Benachrichtigungseinstellungen"
          description="Einstellungen für Benachrichtigungen und Mitteilungen, die Sie vom IT-Sicherheitsassistenten per E-Mail erhalten. Sie können alle Benachrichtigungen deaktivieren."
        >
          <SectionCompanyNotifications />
        </SettingsSection>
        <SettingsSection
          title="Betrieb löschen"
          description="Dauerhafte Löschung des gesamten Betriebes im IT-Sicherheitsassistenten. Dies umfasst alle eigegebenen Daten und Benutzerkonten."
        >
          <SectionCompanyDelete />
        </SettingsSection>
      </SettingsSectionWrapper>
    </BackgroundPanel>
  );
};

export default ContentCompanySettings;
