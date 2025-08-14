"use client";

import { Badge } from "@/components/ui/badge";
import { NotificationsContext } from "@/contexts/NotificationsProvider";
import { useContext } from "react";

const RecommendationsNavIndicator = () => {
  const { openRecommendations } = useContext(NotificationsContext);

  if (openRecommendations !== undefined && openRecommendations > 0) {
    return (
      <Badge className="bg-highlight-100 min-w-7 ms-3 px-1 py-0 text-base justify-center hover:bg-highlight-100">
        {openRecommendations}
      </Badge>
    );
  }
};

export default RecommendationsNavIndicator;
