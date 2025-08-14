"use client";

import { getRecommendationsMetaData } from "@/lib/api/recommendations.api";
import { NotificationsContextType } from "@/types/contexts";
import { createContext, useEffect, useState } from "react";

const NotificationsContext = createContext<NotificationsContextType>({
  openRecommendations: 0,
  refreshRecommendationsCounter: () => {},
});

const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [openRecommendations, setOpenRecommendations] = useState(0);

  const refreshRecommendationsCounter = () => {
    getRecommendationsMetaData()
      .then((res) => setOpenRecommendations(res?.newCounter || 0))
      .catch(() => {});
  };

  useEffect(() => {
    refreshRecommendationsCounter();
  }, []);

  const value = {
    openRecommendations,
    refreshRecommendationsCounter,
  };
  return (
    <>
      <NotificationsContext.Provider value={value}>
        {children}
      </NotificationsContext.Provider>
    </>
  );
};

export { NotificationsProvider, NotificationsContext };
