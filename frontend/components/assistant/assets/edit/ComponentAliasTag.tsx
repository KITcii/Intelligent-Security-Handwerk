import { Badge } from "@/components/ui/badge";
import React from "react";

const ComponentAliasTag = ({ name }: { name: string }) => {
  return (
    <Badge className="text-base h-7 bg-tc-contrast text-highlight-50 border border-highlight-50 hover:text-tc-contrast hover:bg-highlight-50">
      {name}
    </Badge>
  );
};

export default ComponentAliasTag;
