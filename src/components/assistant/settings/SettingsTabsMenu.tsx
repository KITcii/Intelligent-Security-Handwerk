"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { SettingsTabsNames } from "@/types/assistant";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SettingsTabsMenu = ({
  privileged,
  children,
}: {
  privileged: boolean;
  children: React.ReactElement;
}) => {
  const validTabs = ["user", "users", "company"];

  const [activeTab, setActiveTab] = useState<SettingsTabsNames | undefined>(
    undefined
  );

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (value: string) => {
    if (validTabs.includes(value)) {
      setActiveTab(value);
    }
  };

  useEffect(() => {
    let newUrl = "";
    if (activeTab !== undefined) {
      newUrl = formUrlQuery({
        params: searchParams?.toString() || "",
        data: [{ key: "tab", value: activeTab }],
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams?.toString() || "",
        keysToRemove: ["tab"],
      });
    }
    router.push(newUrl, { scroll: false });
  }, [activeTab, router, searchParams]);

  useEffect(() => {
    const initalTab =
      searchParams?.get("tab") !== null ? searchParams?.get("tab") : null;

    if (
      initalTab !== null &&
      initalTab !== undefined &&
      validTabs.includes(initalTab) &&
      initalTab !== activeTab
    ) {
      setActiveTab(initalTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      defaultValue="user"
      className="w-full"
    >
      <TabsList className="w-full justify-start p-4 h-fit gap-4 flex flex-col md:flex-row">
        <TabsTrigger value="user" className="text-base">
          <i className="material-symbols-outlined filled me-2 inline-block align-baseline">
            person
          </i>
          <span>Benutzereinstellungen</span>
        </TabsTrigger>
        <TabsTrigger
          value="company"
          className="text-base flex flex-row"
          disabled={!privileged}
        >
          <i className="material-symbols-outlined filled me-2 inline-block align-baseline">
            factory
          </i>
          <span>Betriebseinstellungen</span>
        </TabsTrigger>
        <TabsTrigger
          value="users"
          className="text-base flex flex-row"
          disabled={!privileged}
        >
          <i className="material-symbols-outlined filled me-2 inline-block align-baseline">
            group
          </i>
          <span>Benutzerverwaltung</span>
        </TabsTrigger>
      </TabsList>
      <div className="mt-8"></div>
      {children}
    </Tabs>
  );
};

export default SettingsTabsMenu;
