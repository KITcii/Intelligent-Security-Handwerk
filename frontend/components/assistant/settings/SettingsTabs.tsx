import { TabsContent } from "@/components/ui/tabs";
import SettingsTabsMenu from "./SettingsTabsMenu";
import ContentUserSettings from "./user/ContentUserSettings";
import ContentCompanySettings from "./company/ContentCompanySettings";
import ContentUsersSettings from "./users/ContentUsersSettings";
import { getUserData } from "@/lib/api/user.api";
import { handleUnauthorized } from "@/lib/utils";

const SettingsTabs = async () => {
  const user = await getUserData();
  if (user === undefined) {
    handleUnauthorized();
  } else {
    return (
      <SettingsTabsMenu privileged={user.roles.includes("OWNER")}>
        <>
          <TabsContent value="user">
            <ContentUserSettings />
          </TabsContent>
          <TabsContent value="company">
            {user.roles.includes("OWNER") ? (
              <ContentCompanySettings />
            ) : (
              <div className="w-full text-center">
                Diese Seite ist zugangsbeschränkt.
              </div>
            )}
          </TabsContent>
          <TabsContent value="users">
            {user.roles.includes("OWNER") ? (
              <ContentUsersSettings />
            ) : (
              <div className="w-full text-center">
                Diese Seite ist zugangsbeschränkt.
              </div>
            )}
          </TabsContent>
        </>
      </SettingsTabsMenu>
    );
  }
};

export default SettingsTabs;
